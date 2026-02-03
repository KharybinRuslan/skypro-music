import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './Filter';
import type { Track } from '@/types/track';

const makeTrack = (overrides: Partial<Track> = {}): Track =>
  ({
    _id: 1,
    name: 'Track',
    author: 'Author A',
    release_date: '2020-01-01',
    genre: ['rock'],
    duration_in_seconds: 180,
    album: 'Album',
    logo: null,
    track_file: '',
    stared_user: [],
    ...overrides,
  }) as Track;

const defaultProps = {
  tracks: [
    makeTrack({ author: 'Author A', genre: ['rock'] }),
    makeTrack({ _id: 2, author: 'Author B', genre: ['pop'] }),
  ],
  selectedAuthor: null,
  selectedGenre: null,
  sortOrder: 'default' as const,
  onAuthorSelect: jest.fn(),
  onGenreSelect: jest.fn(),
  onSortOrderSelect: jest.fn(),
};

describe('Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter buttons', () => {
    render(<Filter {...defaultProps} />);
    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
  });

  it('opens author list on click and calls onAuthorSelect when item clicked', () => {
    render(<Filter {...defaultProps} />);
    fireEvent.click(screen.getByText('исполнителю'));
    expect(screen.getByText('Author A')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Author A'));
    expect(defaultProps.onAuthorSelect).toHaveBeenCalledWith('Author A');
  });

  it('opens genre list on click and calls onGenreSelect when item clicked', () => {
    render(<Filter {...defaultProps} />);
    fireEvent.click(screen.getByText('жанру'));
    expect(screen.getByText('rock')).toBeInTheDocument();
    fireEvent.click(screen.getByText('rock'));
    expect(defaultProps.onGenreSelect).toHaveBeenCalledWith('rock');
  });

  it('opens year list and calls onSortOrderSelect when sort option clicked', () => {
    render(<Filter {...defaultProps} />);
    fireEvent.click(screen.getByText('году выпуска'));
    expect(screen.getByText('Сначала новые')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Сначала новые'));
    expect(defaultProps.onSortOrderSelect).toHaveBeenCalledWith('newest');
  });
});
