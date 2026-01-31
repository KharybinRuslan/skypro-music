'use client';

import { useEffect, useRef } from 'react';
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
} from '@/store/slices/playerSlice';
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

  // Загрузка нового трека
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

  // Управление play/pause
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

  // События audio: timeupdate, duration, ended
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

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handleNext = () => {
    if (!currentTrack || playlist.length === 0) return;
    const next = getNextTrack(playlist, currentTrack, isShuffled);
    if (next) dispatch(setCurrentTrack(next));
  };

  const handlePrev = () => {
    if (!currentTrack || playlist.length === 0) return;
    const prev = getPrevTrack(playlist, currentTrack);
    if (prev) dispatch(setCurrentTrack(prev));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(Number(e.target.value)));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && !isLoadingRef.current) {
      const newTime = Number(e.target.value);
      audio.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  const handleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleRepeat = () => {
    dispatch(toggleRepeat());
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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
          <div className={styles.timeDisplay}>
            <span className={styles.timeCurrent}>
              {formatTime(currentTime)}
            </span>
            <span className={styles.timeTotal}>/ {formatTime(duration)}</span>
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

              <div className={styles.dislike}>
                <div className={styles.btnShuffle}>
                  <svg className={styles.likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </div>
                <div className={styles.dislikeBtn}>
                  <svg className={styles.dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike" />
                  </svg>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
