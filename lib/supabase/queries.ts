import { SupabaseClient } from "@supabase/supabase-js";
import { DbSchedule } from "./db-types";
import { Schedule, TrainingDay, Activity } from "@/lib/types";

function trimTime(t: string | null): string | undefined {
  if (!t) return undefined;
  return t.slice(0, 5);
}

function mapActivity(row: DbSchedule["training_days"][number]["activities"][number]): Activity {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description ?? undefined,
    trainer: row.trainer ?? undefined,
    startTime: trimTime(row.start_time),
    endTime: trimTime(row.end_time),
    estimatedMinutes: row.estimated_minutes ?? undefined,
    url: row.url ?? undefined,
    location: row.location ?? undefined,
    includesPractical: row.includes_practical,
  };
}

function mapDay(row: DbSchedule["training_days"][number]): TrainingDay {
  return {
    id: row.id,
    dayNumber: row.day_number,
    title: row.title,
    date: row.date,
    description: row.description ?? undefined,
    isDayOff: row.is_day_off,
    dayOffReason: row.day_off_reason ?? undefined,
    activities: [...row.activities]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapActivity),
  };
}

export function mapSchedule(row: DbSchedule): Schedule {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    days: [...row.training_days]
      .sort((a, b) => a.day_number - b.day_number)
      .map(mapDay),
  };
}

const SCHEDULE_SELECT = `
  id, name, slug, status,
  training_days (
    id, day_number, title, date, description, is_day_off, day_off_reason, sort_order,
    activities (
      id, type, title, description, trainer,
      start_time, end_time, estimated_minutes, url, location, includes_practical, sort_order
    )
  )
`;

export async function getScheduleBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Schedule | null> {
  const { data, error } = await supabase
    .from("schedules")
    .select(SCHEDULE_SELECT)
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "training_days" })
    .order("sort_order", { referencedTable: "training_days.activities" })
    .maybeSingle();

  if (error) {
    console.error("getScheduleBySlug failed:", error);
    throw new Error(`Failed to load schedule "${slug}": ${error.message}`);
  }

  if (!data) return null;

  return mapSchedule(data as unknown as DbSchedule);
}

export async function getScheduleByIdForAdmin(
  supabase: SupabaseClient,
  id: string
): Promise<Schedule | null> {
  const { data, error } = await supabase
    .from("schedules")
    .select(SCHEDULE_SELECT)
    .eq("id", id)
    .order("sort_order", { referencedTable: "training_days" })
    .order("sort_order", { referencedTable: "training_days.activities" })
    .maybeSingle();

  if (error) {
    console.error("getScheduleByIdForAdmin failed:", error);
    throw new Error(`Failed to load schedule "${id}": ${error.message}`);
  }

  if (!data) return null;

  return mapSchedule(data as unknown as DbSchedule);
}
