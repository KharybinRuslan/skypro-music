'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Search from '@/components/Search/Search';
import Filter from '@/components/Filter/Filter';
import Playlist from '@/components/Playlist/Playlist';
import { Track } from '@/types/track';
import {
  applyFilters,
  type FilterState,
  type SortOrder,
} from '@/lib/tracks/filters';

interface TracksSectionProps {
  tracks: Track[];
  title: string;
  onRemovedFromFavorites?: (trackId: number) => void;
}

const initialState: FilterState = {
  searchQuery: '',
  author: null,
  genre: null,
  sortOrder: 'default',
};

export default function TracksSection({
  tracks,
  title,
  onRemovedFromFavorites,
}: TracksSectionProps) {
  const pathname = usePathname();
  const [filterState, setFilterState] = useState<FilterState>(initialState);

  useEffect(() => {
    setFilterState(initialState);
  }, [pathname]);

  const filteredTracks = useMemo(
    () => applyFilters(tracks, filterState),
    [tracks, filterState],
  );

  const setSearchQuery = (searchQuery: string) => {
    setFilterState((s) => ({ ...s, searchQuery }));
  };

  const setAuthor = (author: string | null) => {
    setFilterState((s) => ({ ...s, author }));
  };

  const setGenre = (genre: string | null) => {
    setFilterState((s) => ({ ...s, genre }));
  };

  const setSortOrder = (sortOrder: SortOrder) => {
    setFilterState((s) => ({ ...s, sortOrder }));
  };

  return (
    <>
      <Search value={filterState.searchQuery} onChange={setSearchQuery} />
      <h2 className="centerblock__h2">{title}</h2>
      <Filter
        tracks={tracks}
        selectedAuthor={filterState.author}
        selectedGenre={filterState.genre}
        sortOrder={filterState.sortOrder}
        onAuthorSelect={setAuthor}
        onGenreSelect={setGenre}
        onSortOrderSelect={setSortOrder}
      />
      {filteredTracks.length === 0 ? (
        <p className="centerblock__content" style={{ color: '#696969' }}>
          Нет подходящих треков
        </p>
      ) : (
        <Playlist
          tracks={filteredTracks}
          onRemovedFromFavorites={onRemovedFromFavorites}
        />
      )}
    </>
  );
}
