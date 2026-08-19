export type ActivityType = "training" | "learning_hub" | "task" | "break";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  trainer?: string;
  startTime?: string; // "09:00"
  endTime?: string; // "10:00"
  estimatedMinutes?: number;
  url?: string;
  location?: string;
}

export interface TrainingDay {
  id: string;
  dayNumber: number;
  title: string;
  date: string; // ISO date "2026-08-17"
  description?: string;
  activities: Activity[];
}

export interface Schedule {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  days: TrainingDay[];
}
