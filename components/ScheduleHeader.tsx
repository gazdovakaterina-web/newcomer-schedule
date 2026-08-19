import { Schedule } from "@/lib/types";
import { formatDateRange } from "@/lib/schedule-dates";

export default function ScheduleHeader({ schedule }: { schedule: Schedule }) {
  return (
    <header className="mb-8">
      <div className="text-xs font-semibold tracking-[0.2em] uppercase text-teal">
        Newcomer Training
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium text-dark-teal mt-1">
        {schedule.name}
      </h1>
      <div className="mt-2 text-sm text-dark-teal/60">
        {schedule.days.length} days · {formatDateRange(schedule.days)}
      </div>
    </header>
  );
}
