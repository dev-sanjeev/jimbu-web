/**
 * Helpers for building month-bounded API windows.
 *
 * The backend stores `created_at` as a UTC timestamp. To select "this month
 * in the user's local timezone", we send full ISO timestamps that encode
 * local-midnight-on-the-first and local-end-of-day-on-the-last, converted
 * to UTC. Bare "YYYY-MM-DD" date strings would be interpreted by Postgres
 * as UTC midnight, which silently drops most of the last day for any
 * non-UTC user.
 */

/** First moment (00:00:00.000) of the given month, in local time. */
export const firstOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

/** Last moment (23:59:59.999) of the given month, in local time. */
export const endOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

/**
 * Month bounds as full ISO timestamps (UTC) suitable for the
 * `/transactions/timeframe` endpoint. Stable for use as a React Query key.
 */
export const monthBoundsISO = (monthAnchor: Date) => ({
  start: firstOfMonth(monthAnchor).toISOString(),
  end: endOfMonth(monthAnchor).toISOString(),
});

/** Human-readable month label, e.g. "May 2026". */
export const monthLabel = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

/** "YYYY-MM" key for the month containing `d`, in local time. Round-trips via `parseMonthParam`. */
export const monthParam = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** Inverse of `monthParam`. Falls back to the current month if `raw` is missing or malformed. */
export const parseMonthParam = (raw: string | undefined): Date => {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split("-").map(Number);
    return new Date(year, month - 1, 1, 0, 0, 0, 0);
  }
  return firstOfMonth(new Date());
};

/** Formats a Date to a `YYYY-MM-DD` string in local time. Suitable for date inputs and API filter params. */
export const toYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const dayLabel = (date: Date) => {
  if (isNaN(date.getTime())) return "Unknown Date";
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};
