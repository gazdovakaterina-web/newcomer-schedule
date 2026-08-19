"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GraduationCap, Puzzle, Wrench, Coffee } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TrainingDay, Activity } from "@/lib/types";
import ActivityEditorModal from "./ActivityEditorModal";

const typeIcon: Record<Activity["type"], typeof GraduationCap> = {
  training: GraduationCap,
  learning_hub: Puzzle,
  task: Wrench,
  break: Coffee,
};

export default function AdminDayCard({ day }: { day: TrainingDay }) {
  const router = useRouter();
  const [title, setTitle] = useState(day.title);
  const [date, setDate] = useState(day.date);
  const [savingMeta, setSavingMeta] = useState(false);
  const [modalState, setModalState] = useState<{ activity: Activity | null } | null>(null);

  async function saveMeta() {
    if (title === day.title && date === day.date) return;
    setSavingMeta(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("training_days")
      .update({ title, date })
      .eq("id", day.id);
    setSavingMeta(false);
    if (error) {
      alert(`Couldn't save day: ${error.message}`);
      return;
    }
    router.refresh();
  }

  async function handleDeleteDay() {
    if (!confirm(`Delete Day ${day.dayNumber} — "${day.title}" — and all its activities?`)) return;
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("training_days").delete().eq("id", day.id);
    if (error) {
      alert(`Couldn't delete day: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <section className="rounded-card bg-white shadow-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium tracking-widest uppercase text-teal/70 mb-1">
            Day {day.dayNumber}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveMeta}
            className="w-full text-lg font-medium text-dark-teal border-b border-transparent hover:border-dark-teal/15 focus:border-teal outline-none pb-0.5 bg-transparent"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={saveMeta}
            className="mt-2 text-sm text-dark-teal/60 border-b border-transparent hover:border-dark-teal/15 focus:border-teal outline-none bg-transparent"
          />
          {savingMeta && <span className="text-xs text-dark-teal/40 ml-2">Saving…</span>}
        </div>

        <button
          onClick={handleDeleteDay}
          className="shrink-0 text-dark-teal/30 hover:text-red-600 transition"
          aria-label={`Delete day ${day.dayNumber}`}
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <div className="space-y-1">
        {day.activities.map((activity) => {
          const Icon = typeIcon[activity.type];
          return (
            <button
              key={activity.id}
              onClick={() => setModalState({ activity })}
              className="w-full flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-sand/70 transition text-left"
            >
              <Icon className="w-4 h-4 shrink-0 text-teal" strokeWidth={2} />
              <span className="flex-1 min-w-0 truncate text-sm text-dark-teal">
                {activity.title}
              </span>
              {(activity.startTime || activity.endTime) && (
                <span className="text-xs text-dark-teal/40 tabular-nums shrink-0">
                  {activity.startTime}
                  {activity.endTime ? `–${activity.endTime}` : ""}
                </span>
              )}
            </button>
          );
        })}

        {day.activities.length === 0 && (
          <p className="text-sm text-dark-teal/40 py-2 px-2">No activities yet.</p>
        )}
      </div>

      <button
        onClick={() => setModalState({ activity: null })}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
      >
        <Plus className="w-4 h-4" strokeWidth={2.25} />
        Add activity
      </button>

      {modalState && (
        <ActivityEditorModal
          trainingDayId={day.id}
          activity={modalState.activity}
          nextSortOrder={day.activities.length}
          onClose={() => setModalState(null)}
        />
      )}
    </section>
  );
}
