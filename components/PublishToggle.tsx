"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Schedule } from "@/lib/types";

export default function PublishToggle({
  scheduleId,
  status,
}: {
  scheduleId: string;
  status: Schedule["status"];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: Schedule["status"]) {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("schedules")
      .update({
        status: next,
        published_at: next === "published" ? new Date().toISOString() : null,
      })
      .eq("id", scheduleId);
    setBusy(false);

    if (error) {
      alert(`Couldn't update status: ${error.message}`);
      return;
    }
    router.refresh();
  }

  if (status === "published") {
    return (
      <button
        onClick={() => setStatus("draft")}
        disabled={busy}
        className="rounded-full border border-dark-teal/20 text-dark-teal font-medium text-sm px-4 py-2 hover:bg-dark-teal/5 transition disabled:opacity-50"
      >
        Unpublish
      </button>
    );
  }

  return (
    <button
      onClick={() => setStatus("published")}
      disabled={busy}
      className="rounded-full bg-lime text-dark-teal font-medium text-sm px-4 py-2 hover:brightness-95 transition disabled:opacity-50"
    >
      {busy ? "Publishing…" : "Publish"}
    </button>
  );
}
