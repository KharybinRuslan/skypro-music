'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './PlayerBar.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  togglePlay,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleShuffle,
  toggleRepeat,
} from '@/store/slices/playerSlice';

export default function PlayerBar() {
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevTrackRef = useRef<number | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const {
    currentTrack,
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
      
      // Сначала паузим текущее воспроизведение
      audio.pause();
      
      // Сбрасываем время
      audio.currentTime = 0;
      dispatch(setCurrentTime(0));
      
      // Загружаем новый трек
      audio.src = currentTrack.track_file;
      
      // Ждем загрузки перед воспроизведением
      const handleCanPlay = () => {
        isLoadingRef.current = false;
        if (isPlaying) {
          audio.play().catch((error) => {
            // Игнорируем ошибки AbortError, так как они могут возникать при быстрой смене треков
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
      
      // Если уже загружено, сразу играем
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
      // Если трека нет, останавливаем воспроизведение
      audio.pause();
      audio.src = '';
      prevTrackRef.current = null;
      isLoadingRef.current = false;
    }
  }, [currentTrack, dispatch]);

  // Управление play/pause (только для уже загруженного трека)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || isLoadingRef.current) return;

    // Проверяем, что трек загружен
    if (audio.readyState < 2) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        // Игнорируем AbortError при быстрой смене треков
        if (error.name !== 'AbortError') {
          console.error('Error playing audio:', error);
          dispatch(togglePlay());
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  // Установка громкости
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  // Обработка событий audio элемента
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isLoadingRef.current) {
        dispatch(setCurrentTime(audio.currentTime));
      }
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
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
  }, [dispatch, isRepeated]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
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

  // Не показываем PlayerBar если нет выбранного трека
  if (!currentTrack) {
    return null;
  }

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      <div className={styles.content}>
        <div className={styles.playerProgress}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressPercent}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className={styles.progressLine}
          />
        </div>
        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.btnPrev}>
                <svg className={styles.btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
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
                  ></use>
                </svg>
              </div>
              <div className={styles.btnNext}>
                <svg className={styles.btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={`${styles.btnRepeat} ${isRepeated ? styles.active : ''}`}
                onClick={handleRepeat}
              >
                <svg className={styles.btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={`${styles.btnShuffle} ${isShuffled ? styles.active : ''}`}
                onClick={handleShuffle}
              >
                <svg className={styles.btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.contain}>
                <div className={styles.image}>
                  <svg className={styles.svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
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
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div className={styles.dislikeBtn}>
                  <svg className={styles.dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={styles.volumeProgress}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  min="0"
                  max="100"
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
