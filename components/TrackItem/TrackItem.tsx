'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './TrackItem.module.css';
import { Track } from '@/types/track';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setCurrentTrack,
  setPlaylist,
  updateTrackLike,
} from '@/store/slices/playerSlice';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { addToFavorites, removeFromFavorites } from '@/lib/api/client';
import { getAccessToken, getUserId } from '@/lib/auth/token';

interface TrackItemProps {
  track: Track;
  playlist: Track[];
  onRemovedFromFavorites?: (trackId: number) => void;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function TrackItem({
  track,
  playlist,
  onRemovedFromFavorites,
}: TrackItemProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const favoriteTrackIds = useAppSelector(
    (state) => state.favorites.favoriteTrackIds,
  );
  const [likeError, setLikeError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = currentTrack?._id === track._id;
  const isLoggedIn = mounted ? !!getAccessToken() : false;
  const userId = mounted ? getUserId() : null;
  const isLiked = favoriteTrackIds.includes(track._id);
  const likeCount = track.stared_user?.length ?? 0;

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(setPlaylist(playlist));
      dispatch(setCurrentTrack(track));
    },
    [dispatch, playlist, track],
  );

  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setLikeError(null);
      if (!isLoggedIn) return;
      if (!userId) return;
      try {
        if (isLiked) {
          await removeFromFavorites(track._id);
          dispatch(removeFavorite(track._id));
          dispatch(
            updateTrackLike({ trackId: track._id, userId, liked: false }),
          );
          onRemovedFromFavorites?.(track._id);
        } else {
          await addToFavorites(track._id);
          dispatch(addFavorite(track._id));
          dispatch(updateTrackLike({ trackId: track._id, userId, liked: true }));
        }
      } catch (err) {
        setLikeError(err instanceof Error ? err.message : 'Ошибка');
        setTimeout(() => setLikeError(null), 3000);
      }
    },
    [isLoggedIn, userId, isLiked, track._id, dispatch, onRemovedFromFavorites],
  );

  return (
    <div className={styles.item} onClick={handleTrackClick}>
      <div className={styles.track}>
        <div className={styles.title}>
          <div className={styles.titleImage}>
            {isActive && isPlaying ? (
              <div className={styles.playingDot}></div>
            ) : (
              <svg className={styles.titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className={styles.titleText}>
            <Link className={styles.titleLink} href="">
              {track.name}
            </Link>
          </div>
        </div>
        <div className={styles.author}>
          <Link className={styles.authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.album}>
          <Link className={styles.albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.time}>
          <button
            type="button"
            className={`${styles.likeBtn} ${isLiked ? styles.likeBtnActive : ''}`}
            onClick={handleLikeClick}
            title={isLoggedIn ? (isLiked ? 'Убрать из избранного' : 'Добавить в избранное') : 'Войдите, чтобы ставить лайки'}
            aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <svg className={styles.timeSvg} viewBox="0 0 16 14">
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
            {likeCount > 0 && (
              <span className={styles.likeCount}>{likeCount}</span>
            )}
          </button>
          {likeError && (
            <span className={styles.likeError} role="alert">
              {likeError}
            </span>
          )}
          <span className={styles.timeText}>
            {formatDuration(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
