import MainLayout from '@/components/MainLayout/MainLayout';
import TracksSection from '@/components/TracksSection/TracksSection';
import { fetchAllTracks } from '@/lib/api/client';
import { Track } from '@/types/track';

export default async function Home() {
  let tracks: Track[] = [];
  let error: string | null = null;
  try {
    tracks = await fetchAllTracks();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Ошибка загрузки треков';
  }

  return (
    <MainLayout>
      {error ? (
        <p style={{ color: '#ff6b6b', marginTop: 16 }}>{error}</p>
      ) : (
        <TracksSection tracks={tracks} title="Треки" />
      )}
    </MainLayout>
  );
}
