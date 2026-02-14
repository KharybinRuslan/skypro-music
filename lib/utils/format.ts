/**
 * Форматирует длительность в секундах в строку M:SS.
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Форматирует время в секундах для отображения в плеере (с проверкой на валидность).
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  return formatDuration(seconds);
}
