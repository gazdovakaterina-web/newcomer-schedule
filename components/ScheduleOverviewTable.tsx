import {
  Presentation,
  MessageCircle,
  Users,
  Puzzle,
  Wrench,
  Coffee,
  CalendarOff,
} from "lucide-react";
import { TrainingDay, ActivityType } from "@/lib/types";
import { formatShortDate, splitActivities } from "@/lib/schedule-dates";

const typeIcon: Record<ActivityType, typeof Presentation> = {
  presentation: Presentation,
  check_in: MessageCircle,
  team_meeting: Users,
  learning_hub: Puzzle,
  task: Wrench,
  break: Coffee,
};

const chipStyle: Record<ActivityType, string> = {
  presentation: "bg-dark-teal text-white",
  team_meeting: "bg-teal text-white",
  learning_hub: "bg-teal text-white",
  check_in: "bg-white text-dark-teal border border-dark-teal/25",
  task: "bg-sand text-dark-teal border border-dark-teal/15",
  break: "bg-transparent text-teal/70",
};

export default function ScheduleOverviewTable({
  days,
  trainingDayNumbers,
}: {
  days: TrainingDay[];
  trainingDayNumbers: Record<string, number>;
}) {
  return (
    <div className="rounded-card bg-white shadow-card divide-y divide-dark-teal/8 overflow-hidden">
      {days.map((day) => {
        if (day.isDayOff) {
          return (
            <div key={day.id} className="p-4 flex gap-4 bg-sand/50">
              <div className="w-20 shrink-0">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-teal/60">
                  Day Off
                </div>
                <div className="text-sm font-medium text-dark-teal/70">
                  {formatShortDate(day.date)}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2 text-sm text-dark-teal/60">
                <CalendarOff className="w-4 h-4 shrink-0" strokeWidth={2} />
                {day.dayOffReason || "No training today"}
              </div>
            </div>
          );
        }

        const { timed, flexible } = splitActivities(day.activities);

        return (
          <div key={day.id} className="p-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-20 shrink-0">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-teal/60">
                Day {trainingDayNumbers[day.id]}
              </div>
              <div className="text-sm font-medium text-dark-teal">
                {formatShortDate(day.date)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-dark-teal mb-1.5">{day.title}</div>
              <div className="flex flex-wrap gap-1.5">
                {[...timed, ...flexible].map((activity) => {
                  const Icon = typeIcon[activity.type];
                  return (
                    <span
                      key={activity.id}
                      title={activity.title}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full max-w-[220px] ${chipStyle[activity.type]}`}
                    >
                      <Icon className="w-3 h-3 shrink-0" strokeWidth={2.25} />
                      {activity.startTime && (
                        <span className="tabular-nums opacity-80 shrink-0">
                          {activity.startTime}
                        </span>
                      )}
                      <span className="truncate">{activity.title}</span>
                    </span>
                  );
                })}
                {day.activities.length === 0 && (
                  <span className="text-xs text-dark-teal/40">Nothing scheduled yet.</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
