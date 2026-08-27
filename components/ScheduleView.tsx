import { TrainingDay, Activity } from "./types";

export function calculateDate(
  startDate: Date,
  dayNumber: number,
  skipWeekends: boolean
): Date {
  const date = new Date(startDate);
  let daysPlaced = 1;

  while (daysPlaced < dayNumber) {
    date.setDate(date.getDate() + 1);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (!skipWeekends || !isWeekend) {
      daysPlaced++;
    }
  }

  return date;
}

export function isToday(isoDate: string): boolean {
  const today = new Date();
  const d = new Date(isoDate + "T00:00:00");
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

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

export function findFocusDayIndex(days: TrainingDay[]): number {
  const todayIdx = days.findIndex((d) => isToday(d.date));
  if (todayIdx !== -1) return todayIdx;

  const upcomingIdx = days.findIndex((d) => !isPast(d.date));
  if (upcomingIdx !== -1) return upcomingIdx;
  return days.length - 1;
}

export function buildTrainingDayNumbers(days: TrainingDay[]): Record<string, number> {
  const map: Record<string, number> = {};
  let n = 0;
  for (const day of days) {
    if (!day.isDayOff) {
      n += 1;
      map[day.id] = n;
    }
  }
  return map;
}

export function countTrainingDays(days: TrainingDay[]): number {
  return days.filter((d) => !d.isDayOff).length;
}

export function formatShortDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function splitActivities(activities: Activity[]): {
  timed: Activity[];
  flexible: Activity[];
} {
  const timed = [...activities]
    .filter((a) => a.startTime || a.endTime)
    .sort((a, b) => (a.startTime ?? a.endTime ?? "").localeCompare(b.startTime ?? b.endTime ?? ""));
  const flexible = activities.filter((a) => !a.startTime && !a.endTime);
  return { timed, flexible };
}
