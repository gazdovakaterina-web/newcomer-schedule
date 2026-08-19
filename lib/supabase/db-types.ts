export interface DbActivity {
  id: string;
  type: "training" | "learning_hub" | "task" | "break";
  title: string;
  description: string | null;
  trainer: string | null;
  start_time: string | null; // "09:00:00"
  end_time: string | null;
  estimated_minutes: number | null;
  url: string | null;
  location: string | null;
  sort_order: number;
}

export interface DbTrainingDay {
  id: string;
  day_number: number;
  title: string;
  date: string; // "2026-08-19"
  description: string | null;
  sort_order: number;
  activities: DbActivity[];
}

export interface DbSchedule {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  training_days: DbTrainingDay[];
}
