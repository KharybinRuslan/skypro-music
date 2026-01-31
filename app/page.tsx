import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';
import Filter from '@/components/Filter/Filter';
import Playlist from '@/components/Playlist/Playlist';
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
      <Search />
      <h2 className="centerblock__h2">Треки</h2>
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
