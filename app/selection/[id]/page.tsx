import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';
import Filter from '@/components/Filter/Filter';
import Playlist from '@/components/Playlist/Playlist';
import { fetchSelectionTracks } from '@/lib/api/client';
import { Track } from '@/types/track';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SelectionPage({ params }: PageProps) {
  const { id } = await params;
  let title = 'Подборка';
  let tracks: Track[] = [];
  let error: string | null = null;

  try {
    const { name, tracks: selectionTracks } = await fetchSelectionTracks(id);
    title = name;
    tracks = selectionTracks;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Ошибка загрузки подборки';
  }

  return (
    <MainLayout>
      <Search />
      <h2 className="centerblock__h2">{title}</h2>
      {error ? (
        <p style={{ color: '#ff6b6b', marginTop: 16 }}>{error}</p>
      ) : (
        <>
          <Filter tracks={tracks} />
          <Playlist tracks={tracks} />
        </>
      )}
    </MainLayout>
  );
}
