import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';

export default function Loading() {
  return (
    <MainLayout>
      <Search />
      <h2 className="centerblock__h2">Загрузка...</h2>
      <p style={{ color: '#696969', marginTop: 16 }}>Загрузка...</p>
    </MainLayout>
  );
}
