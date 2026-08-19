import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminHeaderBar from "@/components/admin/AdminHeaderBar";
import NewScheduleForm from "@/components/admin/NewScheduleForm";
import Link from "next/link";

interface ScheduleListRow {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  created_at: string;
}

const statusStyles: Record<ScheduleListRow["status"], string> = {
  draft: "bg-dark-teal/10 text-dark-teal/70",
  published: "bg-lime text-dark-teal",
  archived: "bg-dark-teal/5 text-dark-teal/40",
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { data: schedules, error } = await supabase
    .from("schedules")
    .select("id, name, slug, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-sand px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <AdminHeaderBar title="Schedules" />

        {error && (
          <p className="mb-4 text-sm text-red-600">
            Couldn't load schedules: {error.message}
          </p>
        )}

        <div className="space-y-3 mb-10">
          {(schedules as ScheduleListRow[] | null)?.map((s) => (
            <Link
              key={s.id}
              href={`/admin/schedules/${s.id}`}
              className="flex items-center justify-between bg-white rounded-card shadow-card px-5 py-4 hover:ring-2 hover:ring-teal/30 transition"
            >
              <div>
                <div className="font-medium text-dark-teal">{s.name}</div>
                <div className="text-sm text-dark-teal/50">/schedule/{s.slug}</div>
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusStyles[s.status]}`}
              >
                {s.status}
              </span>
            </Link>
          ))}

          {schedules && schedules.length === 0 && (
            <p className="text-sm text-dark-teal/60">
              No schedules yet — create one below to get started.
            </p>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-medium text-dark-teal mb-4">New schedule</h2>
          <NewScheduleForm />
        </div>
      </div>
    </main>
  );
}
