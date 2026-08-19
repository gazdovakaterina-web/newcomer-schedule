"use client";

import { useState } from "react";
import { X, GraduationCap, Puzzle, Wrench, Coffee } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Activity, ActivityType } from "@/lib/types";

const typeOptions: { value: ActivityType; label: string; icon: typeof GraduationCap }[] = [
  { value: "training", label: "Instructor-led", icon: GraduationCap },
  { value: "learning_hub", label: "Learning Hub", icon: Puzzle },
  { value: "task", label: "Practical task", icon: Wrench },
  { value: "break", label: "Break", icon: Coffee },
];

export default function ActivityEditorModal({
  trainingDayId,
  activity,
  nextSortOrder,
  onClose,
}: {
  trainingDayId: string;
  activity: Activity | null; // null = creating a new activity
  nextSortOrder: number; // sort_order to use when creating (ignored when editing)
  onClose: () => void;
}) {
  const router = useRouter();
  const [type, setType] = useState<ActivityType>(activity?.type ?? "training");
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [trainer, setTrainer] = useState(activity?.trainer ?? "");
  const [startTime, setStartTime] = useState(activity?.startTime ?? "");
  const [endTime, setEndTime] = useState(activity?.endTime ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    activity?.estimatedMinutes?.toString() ?? ""
  );
  const [url, setUrl] = useState(activity?.url ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createSupabaseBrowserClient();

    const payload = {
      training_day_id: trainingDayId,
      type,
      title,
      description: description || null,
      trainer: type === "training" ? trainer || null : null,
      start_time: startTime || null,
      end_time: endTime || null,
      estimated_minutes:
        type === "learning_hub" || type === "task"
          ? estimatedMinutes
            ? Number(estimatedMinutes)
            : null
          : null,
      url: type !== "break" ? url || null : null,
      ...(activity ? {} : { sort_order: nextSortOrder }),
    };

    const { error } = activity
      ? await supabase.from("activities").update(payload).eq("id", activity.id)
      : await supabase.from("activities").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    onClose();
  }

  async function handleDelete() {
    if (!activity) return;
    if (!confirm(`Delete "${activity.title}"? This can't be undone.`)) return;

    setDeleting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("activities").delete().eq("id", activity.id);
    setDeleting(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-dark-teal/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-card shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-medium text-dark-teal">
            {activity ? "Edit activity" : "Add activity"}
          </h3>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5 text-dark-teal/50" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Activity type picker */}
          <div className="grid grid-cols-4 gap-2">
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = type === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border py-2.5 text-[11px] font-medium transition ${
                    active
                      ? "border-teal bg-teal/10 text-dark-teal"
                      : "border-dark-teal/10 text-dark-teal/50 hover:border-dark-teal/25"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-dark-teal/80">Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-dark-teal/80">
              {type === "task" ? "Instructions" : "Description"}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none resize-none"
            />
          </label>

          {type === "training" && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">Trainer</span>
              <input
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {type !== "task" && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-dark-teal/80">Start</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-dark-teal/80">End</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
                />
              </label>
            </div>
          )}

          {type === "task" && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">Start (optional)</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {(type === "learning_hub" || type === "task") && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">
                Estimated duration (minutes)
              </span>
              <input
                type="number"
                min={0}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {type !== "break" && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">
                {type === "learning_hub" ? "Learning Hub URL" : "Link (optional)"}
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            {activity ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-full bg-dark-teal text-white font-medium text-sm px-5 py-2.5 hover:brightness-110 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
