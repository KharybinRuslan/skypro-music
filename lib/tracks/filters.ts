import type { Track } from '@/types/track';

export type SortOrder = 'newest' | 'oldest' | 'default';

export interface FilterState {
  searchQuery: string;
  author: string | null;
  genre: string | null;
  sortOrder: SortOrder;
}

/**
 * Возвращает уникальный отсортированный список авторов из треков.
 */
export function getUniqueAuthors(tracks: Track[]): string[] {
  const authors = tracks
    .map((t) => t.author)
    .filter((a): a is string => Boolean(a) && a !== '-');
  return Array.from(new Set(authors)).sort();
}

/**
 * Возвращает уникальный отсортированный список жанров из треков.
 */
export function getUniqueGenres(tracks: Track[]): string[] {
  const genres = tracks.flatMap((t) => t.genre ?? []).filter(Boolean);
  return Array.from(new Set(genres)).sort();
}

/**
 * Фильтрует треки по автору (точное совпадение).
 */
export function filterByAuthor(
  tracks: Track[],
  author: string | null,
): Track[] {
  if (!author) return tracks;
  return tracks.filter((t) => t.author === author);
}

/**
 * Фильтрует треки по жанру (трек должен содержать выбранный жанр).
 */
export function filterByGenre(tracks: Track[], genre: string | null): Track[] {
  if (!genre) return tracks;
  return tracks.filter(
    (t) => Array.isArray(t.genre) && t.genre.includes(genre),
  );
}

/**
 * Фильтрует треки по поисковому запросу: название трека начинается с запроса (без учёта регистра).
 */
export function filterBySearch(tracks: Track[], query: string): Track[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return tracks;
  return tracks.filter((t) =>
    (t.name ?? '').toLowerCase().startsWith(trimmed),
  );
}

/**
 * Сортирует треки по дате выпуска.
 * @param order 'newest' — сначала новые, 'oldest' — сначала старые, 'default' — без сортировки (исходный порядок)
 */
export function sortTracks(tracks: Track[], order: SortOrder): Track[] {
  if (order === 'default') return tracks;
  const copy = [...tracks];
  copy.sort((a, b) => {
    const dateA = a.release_date ?? '';
    const dateB = b.release_date ?? '';
    if (order === 'newest') return dateB.localeCompare(dateA);
    return dateA.localeCompare(dateB);
  });
  return copy;
}

/**
 * Применяет все фильтры и сортировку: сначала поиск, затем автор, жанр, затем сортировка.
 * Результат удовлетворяет всем условиям одновременно.
 */
export function applyFilters(
  tracks: Track[],
  state: FilterState,
): Track[] {
  let result = tracks;
  result = filterBySearch(result, state.searchQuery);
  result = filterByAuthor(result, state.author);
  result = filterByGenre(result, state.genre);
  result = sortTracks(result, state.sortOrder);
  return result;
}
