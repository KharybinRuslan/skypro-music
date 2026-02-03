import MainLayout from '@/components/MainLayout/MainLayout';
import TracksSection from '@/components/TracksSection/TracksSection';
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
      {error ? (
        <p style={{ color: '#ff6b6b', marginTop: 16 }}>{error}</p>
      ) : (
        <TracksSection tracks={tracks} title={title} />
      )}
    </MainLayout>
  );
}
