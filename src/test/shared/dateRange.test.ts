import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  monthBoundsISO,
  monthParam,
  parseMonthParam,
  dayLabel,
  toYMD,
} from '@/shared/dateRange';

describe('monthBoundsISO', () => {
  it('start is the first moment of the month in local time', () => {
    const jan = new Date(2026, 0, 1); // Jan 2026 local
    const { start } = monthBoundsISO(jan);
    const d = new Date(start);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(1);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  it('end is the last moment of the month in local time', () => {
    const jan = new Date(2026, 0, 1);
    const { end } = monthBoundsISO(jan);
    const d = new Date(end);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(31);
    expect(d.getHours()).toBe(23);
    expect(d.getMinutes()).toBe(59);
    expect(d.getSeconds()).toBe(59);
    expect(d.getMilliseconds()).toBe(999);
  });

  it('handles February correctly (28 days in non-leap year)', () => {
    const feb = new Date(2025, 1, 1);
    const { end } = monthBoundsISO(feb);
    const d = new Date(end);
    expect(d.getDate()).toBe(28);
  });

  it('handles February correctly (29 days in leap year)', () => {
    const feb = new Date(2024, 1, 1);
    const { end } = monthBoundsISO(feb);
    const d = new Date(end);
    expect(d.getDate()).toBe(29);
  });

  it('start and end are valid ISO strings', () => {
    const { start, end } = monthBoundsISO(new Date(2026, 5, 1));
    expect(() => new Date(start)).not.toThrow();
    expect(() => new Date(end)).not.toThrow();
    expect(isNaN(new Date(start).getTime())).toBe(false);
    expect(isNaN(new Date(end).getTime())).toBe(false);
  });
});

describe('monthParam / parseMonthParam round-trip', () => {
  it('round-trips for a known month', () => {
    const original = new Date(2026, 2, 1); // March 2026
    const param = monthParam(original);
    const parsed = parseMonthParam(param);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(2);
    expect(parsed.getDate()).toBe(1);
  });

  it('monthParam produces YYYY-MM format', () => {
    expect(monthParam(new Date(2026, 0, 1))).toBe('2026-01');
    expect(monthParam(new Date(2026, 11, 1))).toBe('2026-12');
  });

  it('parseMonthParam falls back to current month for undefined', () => {
    const now = new Date();
    const result = parseMonthParam(undefined);
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getMonth()).toBe(now.getMonth());
  });

  it('parseMonthParam falls back to current month for malformed input', () => {
    const now = new Date();
    const result = parseMonthParam('not-a-month');
    expect(result.getFullYear()).toBe(now.getFullYear());
    expect(result.getMonth()).toBe(now.getMonth());
  });
});

describe('dayLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 15, 12, 0, 0)); // Sep 15 2026, noon
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Today" for a date matching today', () => {
    expect(dayLabel(new Date(2026, 8, 15, 9, 0, 0))).toBe('Today');
  });

  it('returns "Yesterday" for a date matching yesterday', () => {
    expect(dayLabel(new Date(2026, 8, 14, 18, 0, 0))).toBe('Yesterday');
  });

  it('returns a formatted date for older dates', () => {
    const result = dayLabel(new Date(2026, 0, 5)); // Jan 5
    expect(result).toContain('Jan');
    expect(result).toContain('5');
  });

  it('returns "Unknown Date" for an invalid date', () => {
    expect(dayLabel(new Date('not-a-date'))).toBe('Unknown Date');
  });
});

describe('toYMD', () => {
  it('formats a date to YYYY-MM-DD', () => {
    expect(toYMD(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toYMD(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('pads single-digit month and day', () => {
    expect(toYMD(new Date(2026, 2, 7))).toBe('2026-03-07');
  });
});
