'use client';

import { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import styles from './Filter.module.css';
import { Track } from '@/types/track';
import { getUniqueAuthors, getUniqueGenres } from '@/lib/tracks/filters';
import type { SortOrder } from '@/lib/tracks/filters';

type FilterType = 'author' | 'year' | 'genre' | null;

interface FilterProps {
  tracks: Track[];
  selectedAuthor: string | null;
  selectedGenre: string | null;
  sortOrder: SortOrder;
  onAuthorSelect: (author: string | null) => void;
  onGenreSelect: (genre: string | null) => void;
  onSortOrderSelect: (order: SortOrder) => void;
}

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'По умолчанию', value: 'default' },
];

export default function Filter({
  tracks,
  selectedAuthor,
  selectedGenre,
  sortOrder,
  onAuthorSelect,
  onGenreSelect,
  onSortOrderSelect,
}: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const uniqueAuthors = useMemo(() => getUniqueAuthors(tracks), [tracks]);
  const uniqueGenres = useMemo(() => getUniqueGenres(tracks), [tracks]);

  const handleFilterClick = useCallback((filterType: FilterType) => {
    setActiveFilter((prev) => (prev === filterType ? null : filterType));
  }, []);

  const handleAuthorClick = useCallback(
    (author: string) => {
      onAuthorSelect(selectedAuthor === author ? null : author);
    },
    [selectedAuthor, onAuthorSelect],
  );

  const handleGenreClick = useCallback(
    (genre: string) => {
      onGenreSelect(selectedGenre === genre ? null : genre);
    },
    [selectedGenre, onGenreSelect],
  );

  const handleSortClick = useCallback(
    (order: SortOrder) => {
      onSortOrderSelect(order);
    },
    [onSortOrderSelect],
  );

  const filterList = useMemo(() => {
    switch (activeFilter) {
      case 'author':
        return uniqueAuthors;
      case 'year':
        return SORT_OPTIONS;
      case 'genre':
        return uniqueGenres;
      default:
        return [];
    }
  }, [activeFilter, uniqueAuthors, uniqueGenres]);

  return (
    <div className={styles.filter}>
      <div className={styles.filterTitle}>Искать по:</div>
      <div className={styles.filterButtons}>
        <div className={styles.filterButtonWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === 'author',
            })}
            onClick={() => handleFilterClick('author')}
          >
            исполнителю
          </button>
          {activeFilter === 'author' && filterList.length > 0 && (
            <div className={styles.filterList}>
              {(filterList as string[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={styles.filterListItem}
                  onClick={() => handleAuthorClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.filterButtonWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === 'year',
            })}
            onClick={() => handleFilterClick('year')}
          >
            году выпуска
          </button>
          {activeFilter === 'year' && filterList.length > 0 && (
            <div className={styles.filterList}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={styles.filterListItem}
                  onClick={() => handleSortClick(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.filterButtonWrapper}>
          <button
            className={classNames(styles.filterButton, {
              [styles.active]: activeFilter === 'genre',
            })}
            onClick={() => handleFilterClick('genre')}
          >
            жанру
          </button>
          {activeFilter === 'genre' && filterList.length > 0 && (
            <div className={styles.filterList}>
              {(filterList as string[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={styles.filterListItem}
                  onClick={() => handleGenreClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
