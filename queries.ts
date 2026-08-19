import { getSupabaseClient } from "./client";
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

function mapSchedule(row: DbSchedule): Schedule {
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

/**
 * Fetches a published schedule by slug, including its days and activities,
 * in one round trip. Returns null if no published schedule matches — the
 * caller (the page component) is responsible for calling notFound() on null,
 * keeping data-fetching and routing concerns separate.
 */
export async function getPublishedScheduleBySlug(slug: string): Promise<Schedule | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
      id, name, slug, status,
      training_days (
        id, day_number, title, date, description, sort_order,
        activities (
          id, type, title, description, trainer,
          start_time, end_time, estimated_minutes, url, location, sort_order
        )
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .order("sort_order", { referencedTable: "training_days" })
    .order("sort_order", { referencedTable: "training_days.activities" })
    .maybeSingle();

  if (error) {
    // Surfacing the real error in server logs is more useful than a generic
    // "not found" here — this only ever runs server-side, never in the browser.
    console.error("getPublishedScheduleBySlug failed:", error);
    throw new Error(`Failed to load schedule "${slug}": ${error.message}`);
  }

  if (!data) return null;

  return mapSchedule(data as unknown as DbSchedule);
}
