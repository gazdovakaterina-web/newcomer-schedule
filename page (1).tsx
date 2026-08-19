import { notFound } from "next/navigation";
import { sampleSchedule } from "@/lib/sample-data";
import { getPublishedScheduleBySlug } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import ScheduleView from "@/components/ScheduleView";
import { Schedule } from "@/lib/types";

// Always fetch fresh — this is a live schedule, not something to cache
// at build time. (Revisit with a shorter revalidate window in Phase 6
// if traffic ever makes that worth it.)
export const dynamic = "force-dynamic";

async function loadSchedule(slug: string): Promise<Schedule | null> {
  if (!isSupabaseConfigured()) {
    // Phase 2 fallback: no Supabase project wired up yet (e.g. running this
    // locally without .env.local). Keeps Phase 1's sample data working so
    // the UI is still checkable without a live database.
    console.warn(
      "[schedule] Supabase not configured — falling back to sample data. See .env.example."
    );
    return slug === sampleSchedule.slug ? sampleSchedule : null;
  }

  return getPublishedScheduleBySlug(slug);
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schedule = await loadSchedule(slug);

  if (!schedule) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand">
      <ScheduleView schedule={schedule} />
    </main>
  );
}
