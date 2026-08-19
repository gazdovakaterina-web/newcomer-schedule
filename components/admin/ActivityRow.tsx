import { GraduationCap, Puzzle, Wrench, Coffee, ArrowUpRight, Clock } from "lucide-react";
import { Activity } from "@/lib/types";

function TypeIcon({ type }: { type: Activity["type"] }) {
  const cls = "w-[18px] h-[18px]";
  switch (type) {
    case "training":
      return <GraduationCap className={cls} strokeWidth={2} />;
    case "learning_hub":
      return <Puzzle className={cls} strokeWidth={2} />;
    case "task":
      return <Wrench className={cls} strokeWidth={2} />;
    case "break":
      return <Coffee className={cls} strokeWidth={2} />;
  }
}

const typeLabel: Record<Activity["type"], string> = {
  training: "Instructor-led",
  learning_hub: "Learning Hub",
  task: "Your turn",
  break: "Break",
};

export default function ActivityRow({ activity }: { activity: Activity }) {
  if (activity.type === "break") {
    return (
      <div className="flex items-center gap-3 py-2 pl-1 text-teal/70">
        <Coffee className="w-4 h-4 shrink-0" strokeWidth={2} />
        <span className="text-sm">{activity.title}</span>
        {(activity.startTime || activity.endTime) && (
          <span className="text-sm ml-auto tabular-nums">
            {activity.startTime}
            {activity.endTime ? `–${activity.endTime}` : ""}
          </span>
        )}
      </div>
    );
  }

  const isTraining = activity.type === "training";
  const isLearningHub = activity.type === "learning_hub";

  const iconBg = isTraining
    ? "bg-dark-teal text-white"
    : isLearningHub
    ? "bg-teal text-white"
    : "bg-sand text-dark-teal border border-dark-teal/15";

  return (
    <div className="flex gap-3 sm:gap-4 py-4 border-b border-dark-teal/8 last:border-b-0">
      <div
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${iconBg}`}
        aria-hidden
      >
        <TypeIcon type={activity.type} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-teal/80">
            {typeLabel[activity.type]}
          </span>
          {(activity.startTime || activity.endTime) && (
            <span className="text-[11px] text-dark-teal/50 tabular-nums">
              {activity.startTime}
              {activity.endTime ? `–${activity.endTime}` : ""}
            </span>
          )}
        </div>

        <h4 className="mt-0.5 font-medium text-dark-teal leading-snug">
          {activity.title}
        </h4>

        {activity.description && (
          <p className="mt-1 text-sm text-dark-teal/70 leading-relaxed">
            {activity.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3">
          {activity.trainer && (
            <span className="text-sm text-dark-teal/60">
              Trainer: <span className="text-dark-teal font-medium">{activity.trainer}</span>
            </span>
          )}
          {activity.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 text-sm text-dark-teal/60">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              ~{activity.estimatedMinutes} min
            </span>
          )}
        </div>

        {activity.url && (
          <a
            href={activity.url}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-medium text-dark-teal hover:brightness-95 transition"
          >
            {isLearningHub ? "Open Learning Hub" : "Open task"}
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
          </a>
        )}
      </div>
    </div>
  );
}
