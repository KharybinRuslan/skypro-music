import Navigation from '@/components/Navigation/Navigation';
import Search from '@/components/Search/Search';
import Sidebar from '@/components/Sidebar/Sidebar';
import PlayerBar from '@/components/PlayerBar/PlayerBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Navigation />
          <div className="centerblock">{children}</div>
          <Sidebar />
        </main>
        <PlayerBar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
