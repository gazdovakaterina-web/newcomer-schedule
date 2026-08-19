import { TrainingDay } from "@/lib/types";
import { formatDayDate, isToday, isPast } from "@/lib/schedule-dates";
import ActivityRow from "./ActivityRow";

export default function DayCard({
  day,
  muted = false,
}: {
  day: TrainingDay;
  muted?: boolean;
}) {
  const today = isToday(day.date);
  const past = isPast(day.date) && !today;

  return (
    <section
      id={`day-${day.dayNumber}`}
      className={`rounded-card bg-white shadow-card p-5 sm:p-7 transition-opacity ${
        muted && past ? "opacity-60" : "opacity-100"
      } ${today ? "ring-2 ring-lime" : ""}`}
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

      <div className="mt-4">
        {day.activities.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}
