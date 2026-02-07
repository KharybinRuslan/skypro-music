'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout/MainLayout';
import TracksSection from '@/components/TracksSection/TracksSection';
import { fetchFavoriteTracks } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/token';
import { Track } from '@/types/track';

export default function FavoritesPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getAccessToken()) {
      router.replace('/auth/signin');
      return;
    }
    setLoading(true);
    setError(null);
    fetchFavoriteTracks()
      .then((data) => {
        setTracks(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Ошибка загрузки избранного',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleRemovedFromFavorites = useCallback((trackId: number) => {
    setTracks((prev) => prev.filter((t) => t._id !== trackId));
  }, []);

  return (
    <MainLayout>
      {loading ? (
        <p className="centerblock__content" style={{ color: '#696969' }}>
          Загрузка...
        </p>
      ) : error ? (
        <p style={{ color: '#ff6b6b', marginTop: 16 }}>{error}</p>
      ) : tracks.length === 0 ? (
        <>
          <h2 className="centerblock__h2">Мой плейлист</h2>
          <p className="centerblock__content" style={{ color: '#696969' }}>
            В избранном пока нет треков
          </p>
        </>
      ) : (
        <TracksSection
          tracks={tracks}
          title="Мой плейлист"
          onRemovedFromFavorites={handleRemovedFromFavorites}
        />
      )}
    </MainLayout>
  );
}
