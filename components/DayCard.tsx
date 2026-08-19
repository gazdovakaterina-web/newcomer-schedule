import { CalendarOff, Clock, CheckCircle2 } from "lucide-react";
import { TrainingDay } from "@/lib/types";
import { formatDayDate, isToday, isPast } from "@/lib/schedule-dates";
import ActivityRow from "./ActivityRow";

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-teal/60 mb-1">
      <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
      {children}
    </div>
  );
}

export default function DayCard({
  day,
  muted = false,
}: {
  day: TrainingDay;
  muted?: boolean;
}) {
  const today = isToday(day.date);
  const past = isPast(day.date) && !today;

  const timedActivities = day.activities
    .filter((a) => a.startTime || a.endTime)
    .sort((a, b) => (a.startTime ?? a.endTime ?? "").localeCompare(b.startTime ?? b.endTime ?? ""));
  const flexibleActivities = day.activities.filter((a) => !a.startTime && !a.endTime);

  return (
    <section
      id={`day-${day.dayNumber}`}
      className={`rounded-card shadow-card p-5 sm:p-7 transition-opacity ${
        day.isDayOff ? "bg-sand border-2 border-dashed border-dark-teal/15" : "bg-white"
      } ${muted && past ? "opacity-60" : "opacity-100"} ${today ? "ring-2 ring-lime" : ""}`}
    >
      <header className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="text-xs font-medium tracking-widest uppercase text-teal/70">
            Day {day.dayNumber}
          </div>
          <h2 className="text-xl sm:text-2xl font-medium text-dark-teal mt-0.5">
            {day.title}
          </h2>
          <div className="text-sm text-dark-teal/50 mt-1">{formatDayDate(day.date)}</div>
        </div>

        {today && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-dark-teal">
            <span className="w-1.5 h-1.5 rounded-full bg-dark-teal animate-pulse-ring" />
            TODAY
          </span>
        )}
      </header>

      {day.isDayOff ? (
        <div className="mt-5 flex items-center gap-3 text-dark-teal/70">
          <CalendarOff className="w-5 h-5 shrink-0" strokeWidth={2} />
          <p className="text-sm">
            No training today
            {day.dayOffReason ? ` — ${day.dayOffReason}` : ""}.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-6">
          {timedActivities.length > 0 && (
            <div>
              <SectionLabel icon={Clock}>Today&rsquo;s Schedule — Fixed Times</SectionLabel>
              <div>
                {timedActivities.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {flexibleActivities.length > 0 && (
            <div className="rounded-xl bg-sand/60 border border-dashed border-dark-teal/15 p-4">
              <SectionLabel icon={CheckCircle2}>Complete Anytime Today</SectionLabel>
              <p className="text-xs text-dark-teal/40 -mt-0.5 mb-1">
                No set time — do these whenever fits your day.
              </p>
              <div>
                {flexibleActivities.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {day.activities.length === 0 && (
            <p className="text-sm text-dark-teal/40">Nothing scheduled yet.</p>
          )}
        </div>
      )}
    </section>
  );
}
