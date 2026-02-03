import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Playlist from './Playlist';
import type { Track } from '@/types/track';

const makeTrack = (overrides: Partial<Track> = {}): Track =>
  ({
    _id: 1,
    name: 'Track One',
    author: 'Author',
    release_date: '2020-01-01',
    genre: ['rock'],
    duration_in_seconds: 180,
    album: 'Album',
    logo: null,
    track_file: '',
    stared_user: [],
    ...overrides,
  }) as Track;

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

describe('Playlist', () => {
  it('renders column headers', () => {
    render(
      <Wrapper>
        <Playlist tracks={[]} />
      </Wrapper>,
    );
    expect(screen.getByText('Трек')).toBeInTheDocument();
    expect(screen.getByText('Исполнитель')).toBeInTheDocument();
    expect(screen.getByText('Альбом')).toBeInTheDocument();
  });

  it('renders track items', () => {
    const tracks = [
      makeTrack({ _id: 1, name: 'First' }),
      makeTrack({ _id: 2, name: 'Second' }),
    ];
    render(
      <Wrapper>
        <Playlist tracks={tracks} />
      </Wrapper>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders empty playlist when no tracks', () => {
    render(
      <Wrapper>
        <Playlist tracks={[]} />
      </Wrapper>,
    );
    expect(screen.getByText('Трек')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });
});
