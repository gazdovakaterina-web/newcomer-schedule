"use client";

import { Check, CalendarOff } from "lucide-react";
import { TrainingDay } from "@/lib/types";
import { isToday, isPast } from "@/lib/schedule-dates";

export default function JourneyRail({
  days,
  trainingDayNumbers,
  activeDayId,
  onSelect,
}: {
  days: TrainingDay[];
  trainingDayNumbers: Record<string, number>;
  activeDayId: string;
  onSelect: (dayId: string) => void;
}) {
  return (
    <nav aria-label="Onboarding journey">
      <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
        {days.map((day) => {
          const today = isToday(day.date);
          const past = isPast(day.date) && !today;
          const active = day.id === activeDayId;
          const trainingNumber = trainingDayNumbers[day.id];

          return (
            <button
              key={day.id}
              onClick={() => onSelect(day.id)}
              className="flex flex-col items-center gap-1.5 w-16 shrink-0 group"
              aria-current={active ? "true" : undefined}
            >
              <span
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition",
                  day.isDayOff && !today
                    ? "bg-sand border-2 border-dashed border-dark-teal/25 text-dark-teal/40"
                    : today
                    ? "bg-lime text-dark-teal ring-4 ring-lime/30"
                    : past
                    ? "bg-dark-teal text-white"
                    : "bg-white border-2 border-dark-teal/20 text-dark-teal/50",
                  active ? "scale-110" : "group-hover:scale-105",
                ].join(" ")}
              >
                {day.isDayOff && !today ? (
                  <CalendarOff className="w-3.5 h-3.5" strokeWidth={2} />
                ) : past ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  trainingNumber
                )}
              </span>
              <span
                className={[
                  "text-[11px] font-medium whitespace-nowrap",
                  active ? "text-dark-teal" : "text-dark-teal/50",
                ].join(" ")}
              >
                {today ? "Today" : day.isDayOff ? "Day off" : `Day ${trainingNumber}`}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
