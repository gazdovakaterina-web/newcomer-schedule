import {
  Presentation,
  MessageCircle,
  Users,
  Puzzle,
  Wrench,
  Coffee,
  ArrowUpRight,
  Video,
  Clock,
} from "lucide-react";
import { Activity, ActivityType } from "@/lib/types";

const typeIcon: Record<ActivityType, typeof Presentation> = {
  presentation: Presentation,
  check_in: MessageCircle,
  team_meeting: Users,
  learning_hub: Puzzle,
  task: Wrench,
  break: Coffee,
};

const typeLabel: Record<ActivityType, string> = {
  presentation: "Presentation",
  check_in: "Check-in",
  team_meeting: "Team Leaders",
  learning_hub: "Learning Hub",
  task: "Your turn",
  break: "Break",
};

const iconStyle: Record<ActivityType, string> = {
  presentation: "bg-dark-teal text-white",
  team_meeting: "bg-teal text-white",
  learning_hub: "bg-teal text-white",
  check_in: "bg-white text-dark-teal border-2 border-dark-teal/25",
  task: "bg-sand text-dark-teal border border-dark-teal/15",
  break: "",
};

function isTeamsLink(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("teams.microsoft.com") || host.includes("teams.live.com");
  } catch {
    return false;
  }
}

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

  const Icon = typeIcon[activity.type];
  const isLearningHub = activity.type === "learning_hub";
  const meetingLabel = isLearningHub ? null : isTeamsLink(activity.url) ? "Join Teams Meeting" : null;

  return (
    <div className="flex gap-3 sm:gap-4 py-4 border-b border-dark-teal/8 last:border-b-0">
      <div
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${iconStyle[activity.type]}`}
        aria-hidden
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
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
          {isLearningHub && activity.includesPractical && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-dark-teal/70 bg-sand border border-dark-teal/15 rounded-full px-2 py-0.5">
              <Wrench className="w-3 h-3" strokeWidth={2} />
              Includes practical task
            </span>
          )}
        </div>

        {activity.url && (
          <a
            href={activity.url}
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
              meetingLabel
                ? "bg-teal text-white hover:brightness-110"
                : "bg-lime text-dark-teal hover:brightness-95"
            }`}
          >
            {meetingLabel ?? (isLearningHub ? "Open Learning Hub" : "Open link")}
            {meetingLabel ? (
              <Video className="w-4 h-4" strokeWidth={2.25} />
            ) : (
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
            )}
          </a>
        )}
      </div>
    </div>
  );
}
