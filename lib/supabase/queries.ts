import { SupabaseClient } from "@supabase/supabase-js";
import { DbSchedule } from "./db-types";
import { Schedule, TrainingDay, Activity } from "@/lib/types";

/** Trims a Postgres "09:00:00" time string down to "09:00" for display. */
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
  };
}

function mapDay(row: DbSchedule["training_days"][number]): TrainingDay {
  return {
    id: row.id,
    dayNumber: row.day_number,
    title: row.title,
    date: row.date,
    description: row.description ?? undefined,
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
    id, day_number, title, date, description, sort_order,
    activities (
      id, type, title, description, trainer,
      start_time, end_time, estimated_minutes, url, location, sort_order
    )
  )
`;

/**
 * Fetches a schedule by slug for the PUBLIC page. Deliberately does not
 * filter by status in the query itself — RLS does that job instead:
 * anonymous visitors only match the "public read published schedules"
 * policy, so a draft slug resolves to null for them. A logged-in admin
 * (same client, but with a session) additionally matches "admin full access
 * schedules", so this doubles as the "Preview" link for drafts without any
 * extra code path.
 */
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

/**
 * Fetches a schedule by id regardless of status (draft/published/archived) —
 * for admin use only. Pass in an authenticated server or browser client;
 * RLS's "admin full access" policies (see supabase/phase3-admin.sql) are
 * what actually gate this, not anything in this function.
 */
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
