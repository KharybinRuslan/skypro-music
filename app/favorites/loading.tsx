import MainLayout from '@/components/MainLayout/MainLayout';
import Search from '@/components/Search/Search';

export default function FavoritesLoading() {
  return (
    <MainLayout>
      <Search />
      <h2 className="centerblock__h2">Мой плейлист</h2>
      <p className="centerblock__content" style={{ color: '#696969' }}>
        Загрузка...
      </p>
    </MainLayout>
  );
}
