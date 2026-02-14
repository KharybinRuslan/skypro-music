import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';
import TrackListSkeleton from '@/components/TrackListSkeleton/TrackListSkeleton';

export default function Loading() {
  return (
    <MainLayout>
      <Search />
      <h2 className="centerblock__h2">Треки</h2>
      <TrackListSkeleton />
    </MainLayout>
  );
}
