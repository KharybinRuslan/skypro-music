import { formatDuration, formatTime } from './format';

describe('formatDuration', () => {
  it('formats seconds as M:SS', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(180)).toBe('3:00');
  });
});

describe('formatTime', () => {
  it('formats valid seconds', () => {
    expect(formatTime(90)).toBe('1:30');
  });

  it('returns 0:00 for invalid values', () => {
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(-1)).toBe('0:00');
    expect(formatTime(Infinity)).toBe('0:00');
  });
});
