import { TrainingDay } from "./types";

/**
 * Calculates the calendar date for a given day number, starting from
 * startDate (inclusive, day 1 = startDate), optionally skipping weekends.
 */
export function calculateDate(
  startDate: Date,
  dayNumber: number,
  skipWeekends: boolean
): Date {
  const date = new Date(startDate);
  let daysPlaced = 1; // startDate itself is day 1

  while (daysPlaced < dayNumber) {
    date.setDate(date.getDate() + 1);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (!skipWeekends || !isWeekend) {
      daysPlaced++;
    }
  }

  return date;
}

/** Returns true if the given ISO date string is "today" (calendar date, not time). */
export function isToday(isoDate: string): boolean {
  const today = new Date();
  const d = new Date(isoDate + "T00:00:00");
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/** Returns true if the given ISO date string is strictly before today. */
export function isPast(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(isoDate + "T00:00:00");
  return d.getTime() < today.getTime();
}

export function formatDayDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatDateRange(days: TrainingDay[]): string {
  if (days.length === 0) return "";
  const first = new Date(days[0].date + "T00:00:00");
  const last = new Date(days[days.length - 1].date + "T00:00:00");
  const sameMonth = first.getMonth() === last.getMonth();
  const firstStr = first.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const lastStr = last.toLocaleDateString(
    "en-US",
    sameMonth ? { day: "numeric" } : { month: "long", day: "numeric" }
  );
  return `${firstStr}–${lastStr}`;
}

/** Finds the index of today's day within the schedule, or the closest upcoming day. */
export function findFocusDayIndex(days: TrainingDay[]): number {
  const todayIdx = days.findIndex((d) => isToday(d.date));
  if (todayIdx !== -1) return todayIdx;

  // No exact match (e.g. weekend, or before/after the schedule) — find the
  // closest day: first upcoming day, or the last day if the schedule has ended.
  const upcomingIdx = days.findIndex((d) => !isPast(d.date));
  if (upcomingIdx !== -1) return upcomingIdx;
  return days.length - 1;
}
