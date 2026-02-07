'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './PlayerBar.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentTrack,
  togglePlay,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleShuffle,
  toggleRepeat,
  updateTrackLike,
} from '@/store/slices/playerSlice';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { addToFavorites, removeFromFavorites } from '@/lib/api/client';
import { getAccessToken, getUserId } from '@/lib/auth/token';
import { Track } from '@/types/track';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getNextTrack(
  playlist: Track[],
  currentTrack: Track,
  isShuffled: boolean,
): Track | null {
  if (playlist.length === 0) return null;
  if (isShuffled) {
    if (playlist.length === 1) return currentTrack;
    const others = playlist.filter((t) => t._id !== currentTrack._id);
    return others[Math.floor(Math.random() * others.length)] ?? null;
  }
  const idx = playlist.findIndex((t) => t._id === currentTrack._id);
  if (idx < 0 || idx >= playlist.length - 1) return null;
  return playlist[idx + 1] ?? null;
}

function getPrevTrack(playlist: Track[], currentTrack: Track): Track | null {
  if (playlist.length === 0) return null;
  const idx = playlist.findIndex((t) => t._id === currentTrack._id);
  if (idx <= 0) return null;
  return playlist[idx - 1] ?? null;
}

export default function PlayerBar() {
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevTrackRef = useRef<number | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const {
    currentTrack,
    playlist,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    isRepeated,
  } = useAppSelector((state) => state.player);
  const favoriteTrackIds = useAppSelector(
    (state) => state.favorites.favoriteTrackIds,
  );
  const [mounted, setMounted] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likePendingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? !!getAccessToken() : false;
  const userId = mounted ? getUserId() : null;
  const isLiked =
    currentTrack != null && favoriteTrackIds.includes(currentTrack._id);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isNewTrack = prevTrackRef.current !== currentTrack?._id;

    if (currentTrack && isNewTrack) {
      isLoadingRef.current = true;
      prevTrackRef.current = currentTrack._id;

      audio.pause();
      audio.currentTime = 0;
      dispatch(setCurrentTime(0));

      audio.src = currentTrack.track_file;

      const handleCanPlay = () => {
        isLoadingRef.current = false;
        if (isPlaying) {
          audio.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Error playing audio:', error);
            }
            dispatch(togglePlay());
          });
        }
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };

      const handleError = () => {
        isLoadingRef.current = false;
        console.error('Error loading audio');
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      if (audio.readyState >= 3) {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        isLoadingRef.current = false;
        if (isPlaying) {
          audio.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Error playing audio:', error);
            }
            dispatch(togglePlay());
          });
        }
      }
    } else if (!currentTrack) {
      audio.pause();
      audio.src = '';
      prevTrackRef.current = null;
      isLoadingRef.current = false;
    }
  }, [currentTrack, dispatch, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || isLoadingRef.current) return;
    if (audio.readyState < 2) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error playing audio:', error);
          dispatch(togglePlay());
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isLoadingRef.current) {
        dispatch(setCurrentTime(audio.currentTime));
      }
    };

    const updateDuration = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        dispatch(setDuration(audio.duration));
      }
    };

    const handleEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Error replaying audio:', error);
          }
        });
        return;
      }
      const next = getNextTrack(playlist, currentTrack!, isShuffled);
      if (next) {
        dispatch(setCurrentTrack(next));
      } else {
        dispatch(togglePlay());
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch, isRepeated, isShuffled, playlist, currentTrack]);

  const handlePlayPause = useCallback(() => {
    dispatch(togglePlay());
  }, [dispatch]);

  const handleNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const next = getNextTrack(playlist, currentTrack, isShuffled);
    if (next) dispatch(setCurrentTrack(next));
  }, [currentTrack, playlist, isShuffled, dispatch]);

  const handlePrev = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return;
    const prev = getPrevTrack(playlist, currentTrack);
    if (prev) dispatch(setCurrentTrack(prev));
  }, [currentTrack, playlist, dispatch]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setVolume(Number(e.target.value)));
    },
    [dispatch],
  );

  const handleProgressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (audio && !isLoadingRef.current) {
        const newTime = Number(e.target.value);
        audio.currentTime = newTime;
        dispatch(setCurrentTime(newTime));
      }
    },
    [dispatch],
  );

  const handleShuffle = useCallback(() => {
    dispatch(toggleShuffle());
  }, [dispatch]);

  const handleRepeat = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  const handleLikeClick = useCallback(async () => {
    if (!currentTrack) return;
    const token = getAccessToken();
    const uid = getUserId();
    if (!token || !uid) return;
    if (likePendingRef.current) return;
    likePendingRef.current = true;
    setLikeError(null);
    const wasLiked =
      favoriteTrackIds.includes(currentTrack._id);
    try {
      if (wasLiked) {
        await removeFromFavorites(currentTrack._id);
        dispatch(removeFavorite(currentTrack._id));
        dispatch(
          updateTrackLike({
            trackId: currentTrack._id,
            userId: uid,
            liked: false,
          }),
        );
      } else {
        await addToFavorites(currentTrack._id);
        dispatch(addFavorite(currentTrack._id));
        dispatch(
          updateTrackLike({
            trackId: currentTrack._id,
            userId: uid,
            liked: true,
          }),
        );
      }
    } catch (err) {
      setLikeError(err instanceof Error ? err.message : 'Ошибка');
      setTimeout(() => setLikeError(null), 3000);
    } finally {
      likePendingRef.current = false;
    }
  }, [currentTrack, favoriteTrackIds, dispatch]);

  const progressPercent = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration],
  );

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      <div className={styles.content}>
        <div className={styles.playerProgressWrap}>
          <div className={styles.playerProgress}>
            <div
              className={styles.progressBar}
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className={styles.progressLine}
            />
          </div>
        </div>
        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.btnPrev} onClick={handlePrev}>
                <svg className={styles.btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
                </svg>
              </div>
              <div className={styles.btnPlay} onClick={handlePlayPause}>
                <svg className={styles.btnPlaySvg}>
                  <use
                    xlinkHref={
                      isPlaying
                        ? '/img/icon/sprite.svg#icon-pause'
                        : '/img/icon/sprite.svg#icon-play'
                    }
                  />
                </svg>
              </div>
              <div className={styles.btnNext} onClick={handleNext}>
                <svg className={styles.btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next" />
                </svg>
              </div>
              <div
                className={`${styles.btnRepeat} ${isRepeated ? styles.active : ''}`}
                onClick={handleRepeat}
              >
                <svg className={styles.btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </div>
              <div
                className={`${styles.btnShuffle} ${isShuffled ? styles.active : ''}`}
                onClick={handleShuffle}
              >
                <svg className={styles.btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle" />
                </svg>
              </div>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.contain}>
                <div className={styles.image}>
                  <svg className={styles.svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                  </svg>
                </div>
                <div className={styles.author}>
                  <Link className={styles.authorLink} href="">
                    {currentTrack?.name || 'Ты та...'}
                  </Link>
                </div>
                <div className={styles.album}>
                  <Link className={styles.albumLink} href="">
                    {currentTrack?.author || 'Баста'}
                  </Link>
                </div>
              </div>

              <div className={styles.likeWrap}>
                <button
                  type="button"
                  className={`${styles.likeBtn} ${isLiked ? styles.likeBtnActive : ''}`}
                  onClick={handleLikeClick}
                  title={
                    isLoggedIn
                      ? isLiked
                        ? 'Убрать из избранного'
                        : 'Добавить в избранное'
                      : 'Войдите, чтобы ставить лайки'
                  }
                  aria-label={
                    isLiked ? 'Убрать из избранного' : 'Добавить в избранное'
                  }
                >
                  <svg className={styles.likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </button>
                {likeError && (
                  <span className={styles.likeError} role="alert">
                    {likeError}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume" />
                </svg>
              </div>
              <div className={styles.volumeProgress}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
            <div className={styles.timeDisplay}>
              <span className={styles.timeCurrent}>
                {formatTime(currentTime)}
              </span>
              <span className={styles.timeTotal}>
                / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
