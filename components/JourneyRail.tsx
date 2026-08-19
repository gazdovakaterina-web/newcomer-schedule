"use client";

import { Check, CalendarOff } from "lucide-react";
import { TrainingDay } from "@/lib/types";
import { isToday, isPast } from "@/lib/schedule-dates";

export default function JourneyRail({
  days,
  activeDayNumber,
  onSelect,
}: {
  days: TrainingDay[];
  activeDayNumber: number;
  onSelect: (dayNumber: number) => void;
}) {
  return (
    <nav aria-label="Onboarding journey" className="relative">
      <div className="flex items-start overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
        {days.map((day, idx) => {
          const today = isToday(day.date);
          const past = isPast(day.date) && !today;
          const active = day.dayNumber === activeDayNumber;
          const isLast = idx === days.length - 1;

          return (
            <div key={day.id} className="flex items-start shrink-0">
              <button
                onClick={() => onSelect(day.dayNumber)}
                className="flex flex-col items-center gap-2 px-2 sm:px-3 group"
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
                    day.dayNumber
                  )}
                </span>
                <span
                  className={[
                    "text-[11px] font-medium whitespace-nowrap",
                    active ? "text-dark-teal" : "text-dark-teal/50",
                  ].join(" ")}
                >
                  {today ? "Today" : day.isDayOff ? "Day off" : `Day ${day.dayNumber}`}
                </span>
              </button>

              {!isLast && (
                <div className="w-6 sm:w-10 h-[2px] mt-4 bg-dark-teal/15 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
