import { notFound } from "next/navigation";
import { sampleSchedule } from "@/lib/sample-data";
import { getScheduleBySlug } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ScheduleView from "@/components/ScheduleView";
import { Schedule } from "@/lib/types";

// Always fetch fresh — this is a live schedule, not something to cache
// at build time.
export const dynamic = "force-dynamic";

async function loadSchedule(slug: string): Promise<Schedule | null> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "[schedule] Supabase not configured — falling back to sample data. See .env.example."
    );
    return slug === sampleSchedule.slug ? sampleSchedule : null;
  }

  const supabase = await createSupabaseServerClient();
  return getScheduleBySlug(supabase, slug);
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
