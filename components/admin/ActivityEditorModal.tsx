"use client";

import { useState } from "react";
import {
  X,
  Presentation,
  MessageCircle,
  Users,
  Puzzle,
  Wrench,
  Coffee,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Activity, ActivityType } from "@/lib/types";

const typeOptions: { value: ActivityType; label: string; icon: typeof Presentation }[] = [
  { value: "presentation", label: "Presentation", icon: Presentation },
  { value: "check_in", label: "Check-in", icon: MessageCircle },
  { value: "team_meeting", label: "Team Leaders", icon: Users },
  { value: "learning_hub", label: "Learning Hub", icon: Puzzle },
  { value: "task", label: "Practical task", icon: Wrench },
  { value: "break", label: "Break", icon: Coffee },
];

const TRAINER_TYPES = new Set<ActivityType>(["presentation", "check_in", "team_meeting"]);
const SINGLE_TIME_TYPES = new Set<ActivityType>(["task", "check_in"]);
const DURATION_TYPES = new Set<ActivityType>(["learning_hub", "task", "check_in"]);
function defaultTimedFor(type: ActivityType): boolean {
  return type === "break" || type === "presentation" || type === "team_meeting";
}

export default function ActivityEditorModal({
  trainingDayId,
  activity,
  nextSortOrder,
  onClose,
}: {
  trainingDayId: string;
  activity: Activity | null;
  nextSortOrder: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const [type, setType] = useState<ActivityType>(activity?.type ?? "presentation");
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [trainer, setTrainer] = useState(activity?.trainer ?? "");
  const [startTime, setStartTime] = useState(activity?.startTime ?? "");
  const [endTime, setEndTime] = useState(activity?.endTime ?? "");
  const [hasTime, setHasTime] = useState<boolean>(
    activity ? Boolean(activity.startTime || activity.endTime) : defaultTimedFor(type)
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    activity?.estimatedMinutes?.toString() ?? ""
  );
  const [url, setUrl] = useState(activity?.url ?? "");
  const [includesPractical, setIncludesPractical] = useState(
    Boolean(activity?.includesPractical)
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTypeChange(next: ActivityType) {
    setType(next);
    if (!activity) {
      setHasTime(defaultTimedFor(next));
    } else if (next === "break") {
      setHasTime(true);
    }
  }

  const timed = type === "break" ? true : hasTime;

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
      trainer: TRAINER_TYPES.has(type) ? trainer || null : null,
      start_time: timed && startTime ? startTime : null,
      end_time: timed && !SINGLE_TIME_TYPES.has(type) && endTime ? endTime : null,
      estimated_minutes: DURATION_TYPES.has(type)
        ? estimatedMinutes
          ? Number(estimatedMinutes)
          : null
        : null,
      url: type !== "break" ? url || null : null,
      includes_practical: type === "learning_hub" ? includesPractical : false,
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
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = type === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleTypeChange(opt.value)}
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

          {TRAINER_TYPES.has(type) && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">
                {type === "team_meeting" ? "Team Leader" : "Trainer"}
              </span>
              <input
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {type !== "break" && (
            <label className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={hasTime}
                onChange={(e) => setHasTime(e.target.checked)}
                className="w-4 h-4 rounded border-dark-teal/30 text-teal focus:ring-teal"
              />
              <span className="text-sm font-medium text-dark-teal/80">
                Happens at a specific time
              </span>
            </label>
          )}

          {!timed && type !== "break" && (
            <p className="text-sm text-dark-teal/50 -mt-2">
              This will show as a to-do for the day — the trainee completes it whenever works for them, with no fixed slot.
            </p>
          )}

          {timed && !SINGLE_TIME_TYPES.has(type) && (
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

          {timed && SINGLE_TIME_TYPES.has(type) && (
            <label className="block">
              <span className="text-sm font-medium text-dark-teal/80">Start</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-dark-teal/15 px-3 py-2 text-dark-teal focus:border-teal outline-none"
              />
            </label>
          )}

          {DURATION_TYPES.has(type) && (
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

          {type === "learning_hub" && (
            <label className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={includesPractical}
                onChange={(e) => setIncludesPractical(e.target.checked)}
                className="w-4 h-4 rounded border-dark-teal/30 text-teal focus:ring-teal"
              />
              <span className="text-sm font-medium text-dark-teal/80">
                Includes a hands-on practical exercise
              </span>
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
