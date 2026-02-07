import {
  getUniqueAuthors,
  getUniqueGenres,
  filterByAuthor,
  filterByGenre,
  filterBySearch,
  sortTracks,
  applyFilters,
  type FilterState,
  type SortOrder,
} from './filters';
import type { Track } from '@/types/track';

const makeTrack = (overrides: Partial<Track> = {}): Track =>
  ({
    _id: 1,
    name: 'Track',
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

describe('getUniqueAuthors', () => {
  it('returns sorted unique authors', () => {
    const tracks = [
      makeTrack({ author: 'B' }),
      makeTrack({ author: 'A' }),
      makeTrack({ author: 'B' }),
    ];
    expect(getUniqueAuthors(tracks)).toEqual(['A', 'B']);
  });

  it('filters out empty and "-" authors', () => {
    const tracks = [
      makeTrack({ author: 'A' }),
      makeTrack({ author: '' }),
      makeTrack({ author: '-' }),
    ];
    expect(getUniqueAuthors(tracks)).toEqual(['A']);
  });

  it('returns empty array for empty tracks', () => {
    expect(getUniqueAuthors([])).toEqual([]);
  });
});

describe('getUniqueGenres', () => {
  it('returns sorted unique genres from all tracks', () => {
    const tracks = [
      makeTrack({ genre: ['rock', 'pop'] }),
      makeTrack({ genre: ['jazz'] }),
      makeTrack({ genre: ['rock'] }),
    ];
    expect(getUniqueGenres(tracks)).toEqual(['jazz', 'pop', 'rock']);
  });

  it('handles missing genre', () => {
    const tracks = [makeTrack({ genre: undefined as unknown as string[] })];
    expect(getUniqueGenres(tracks)).toEqual([]);
  });

  it('returns empty array for empty tracks', () => {
    expect(getUniqueGenres([])).toEqual([]);
  });
});

describe('filterByAuthor', () => {
  it('returns all tracks when author is null', () => {
    const tracks = [makeTrack({ author: 'A' })];
    expect(filterByAuthor(tracks, null)).toEqual(tracks);
  });

  it('returns only tracks with matching author', () => {
    const tracks = [
      makeTrack({ _id: 1, author: 'A' }),
      makeTrack({ _id: 2, author: 'B' }),
      makeTrack({ _id: 3, author: 'A' }),
    ];
    expect(filterByAuthor(tracks, 'A')).toHaveLength(2);
    expect(filterByAuthor(tracks, 'A').map((t) => t._id)).toEqual([1, 3]);
  });

  it('returns empty when no match', () => {
    const tracks = [makeTrack({ author: 'A' })];
    expect(filterByAuthor(tracks, 'B')).toEqual([]);
  });
});

describe('filterByGenre', () => {
  it('returns all tracks when genre is null', () => {
    const tracks = [makeTrack({ genre: ['rock'] })];
    expect(filterByGenre(tracks, null)).toEqual(tracks);
  });

  it('returns only tracks containing the genre', () => {
    const tracks = [
      makeTrack({ _id: 1, genre: ['rock'] }),
      makeTrack({ _id: 2, genre: ['pop', 'rock'] }),
      makeTrack({ _id: 3, genre: ['jazz'] }),
    ];
    expect(filterByGenre(tracks, 'rock')).toHaveLength(2);
    expect(filterByGenre(tracks, 'rock').map((t) => t._id)).toEqual([1, 2]);
  });

  it('returns empty when no track has genre', () => {
    const tracks = [makeTrack({ genre: ['rock'] })];
    expect(filterByGenre(tracks, 'jazz')).toEqual([]);
  });
});

describe('filterBySearch', () => {
  it('returns all tracks when query is empty or whitespace', () => {
    const tracks = [makeTrack({ name: 'Hello' })];
    expect(filterBySearch(tracks, '')).toEqual(tracks);
    expect(filterBySearch(tracks, '   ')).toEqual(tracks);
  });

  it('returns tracks whose name starts with query (case insensitive)', () => {
    const tracks = [
      makeTrack({ _id: 1, name: 'Abc' }),
      makeTrack({ _id: 2, name: 'abc' }),
      makeTrack({ _id: 3, name: 'Xabc' }),
    ];
    const result = filterBySearch(tracks, 'ab');
    expect(result.map((t) => t._id)).toEqual([1, 2]);
  });

  it('returns empty when no match', () => {
    const tracks = [makeTrack({ name: 'Hello' })];
    expect(filterBySearch(tracks, 'xyz')).toEqual([]);
  });

  it('handles track with missing name', () => {
    const tracks = [makeTrack({ name: undefined as unknown as string })];
    expect(filterBySearch(tracks, 'ab')).toEqual([]);
  });
});

describe('sortTracks', () => {
  const tracks = [
    makeTrack({ _id: 1, release_date: '2020-01-01' }),
    makeTrack({ _id: 2, release_date: '2022-01-01' }),
    makeTrack({ _id: 3, release_date: '2021-01-01' }),
  ];

  it('returns same order for default', () => {
    expect(sortTracks(tracks, 'default').map((t) => t._id)).toEqual([1, 2, 3]);
  });

  it('sorts newest first', () => {
    expect(sortTracks(tracks, 'newest').map((t) => t._id)).toEqual([2, 3, 1]);
  });

  it('sorts oldest first', () => {
    expect(sortTracks(tracks, 'oldest').map((t) => t._id)).toEqual([1, 3, 2]);
  });

  it('handles empty release_date', () => {
    const withEmpty = [
      makeTrack({ _id: 1, release_date: '' }),
      makeTrack({ _id: 2, release_date: '2021-01-01' }),
    ];
    expect(sortTracks(withEmpty, 'newest').map((t) => t._id)).toEqual([2, 1]);
  });
});

describe('applyFilters', () => {
  const tracks = [
    makeTrack({
      _id: 1,
      name: 'Rock Song',
      author: 'A',
      genre: ['rock'],
      release_date: '2020-01-01',
    }),
    makeTrack({
      _id: 2,
      name: 'Pop Song',
      author: 'A',
      genre: ['pop'],
      release_date: '2022-01-01',
    }),
    makeTrack({
      _id: 3,
      name: 'Rock Two',
      author: 'B',
      genre: ['rock'],
      release_date: '2021-01-01',
    }),
  ];

  it('applies search, author, genre and sort together', () => {
    const state: FilterState = {
      searchQuery: 'Rock',
      author: 'A',
      genre: 'rock',
      sortOrder: 'newest',
    };
    const result = applyFilters(tracks, state);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe(1);
  });

  it('returns empty when no track matches all conditions', () => {
    const state: FilterState = {
      searchQuery: 'Pop',
      author: 'B',
      genre: 'pop',
      sortOrder: 'default',
    };
    expect(applyFilters(tracks, state)).toEqual([]);
  });

  it('returns all tracks when state is default', () => {
    const state: FilterState = {
      searchQuery: '',
      author: null,
      genre: null,
      sortOrder: 'default',
    };
    expect(applyFilters(tracks, state)).toHaveLength(3);
  });
});
