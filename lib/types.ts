export type ActivityType =
  | "presentation" // formal instructor-led session, e.g. a scheduled talk
  | "check_in" // brief, often informal touchpoint with a trainer
  | "team_meeting" // meeting with team leaders
  | "learning_hub" // self-study lesson in the Learning Hub
  | "task" // practical exercise the trainee does on their own
  | "break";

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
  isDayOff?: boolean; // bank holiday, team building, etc. — no training scheduled
  dayOffReason?: string; // e.g. "Bank Holiday", "Company Team Building"
  activities: Activity[];
}

export interface Schedule {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  days: TrainingDay[];
}
