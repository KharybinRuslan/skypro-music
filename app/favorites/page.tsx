'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';
import TracksSection from '@/components/TracksSection/TracksSection';
import TrackListSkeleton from '@/components/TrackListSkeleton/TrackListSkeleton';
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
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки избранного';
        setError(message);
        toast.error(message);
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
        <>
          <Search />
          <h2 className="centerblock__h2">Мой плейлист</h2>
          <TrackListSkeleton />
        </>
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
