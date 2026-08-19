import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScheduleByIdForAdmin } from "@/lib/supabase/queries";
import AdminHeaderBar from "@/components/admin/AdminHeaderBar";
import AdminScheduleEditor from "@/components/admin/AdminScheduleEditor";
import PublishToggle from "@/components/admin/PublishToggle";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function AdminScheduleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const schedule = await getScheduleByIdForAdmin(supabase, id);

  if (!schedule) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand px-4 sm:px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <AdminHeaderBar title={schedule.name} backHref="/admin" />

        <div className="flex items-center justify-between mb-6 -mt-4">
          <Link
            href={`/schedule/${schedule.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-teal hover:underline"
          >
            {schedule.status === "published" ? "View public page" : "Preview"}
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
          <PublishToggle scheduleId={schedule.id} status={schedule.status} />
        </div>

        <AdminScheduleEditor schedule={schedule} />
      </div>
    </main>
  );
}
