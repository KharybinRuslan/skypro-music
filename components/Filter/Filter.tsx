'use client';

import { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import styles from './Filter.module.css';
import { Track } from '@/types/track';

type FilterType = 'author' | 'year' | 'genre' | null;

interface FilterProps {
  tracks: Track[];
}

const yearOptions = ['Сначала новые', 'Сначала старые', 'По умолчанию'];

export default function Filter({ tracks }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const uniqueAuthors = useMemo(() => {
    const authors = tracks
      .map((track) => track.author)
      .filter((author) => author && author !== '-');
    return Array.from(new Set(authors)).sort();
  }, [tracks]);

  const uniqueGenres = useMemo(() => {
    const genres = tracks.flatMap((track) => track.genre);
    return Array.from(new Set(genres)).sort();
  }, [tracks]);

  const handleFilterClick = useCallback((filterType: FilterType) => {
    setActiveFilter((prev) => (prev === filterType ? null : filterType));
  }, []);

  const filterList = useMemo(() => {
    switch (activeFilter) {
      case 'author':
        return uniqueAuthors;
      case 'year':
        return yearOptions;
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
              {filterList.map((item, index) => (
                <div key={index} className={styles.filterListItem}>
                  {item}
                </div>
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
              {filterList.map((item, index) => (
                <div key={index} className={styles.filterListItem}>
                  {item}
                </div>
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
              {filterList.map((item, index) => (
                <div key={index} className={styles.filterListItem}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
