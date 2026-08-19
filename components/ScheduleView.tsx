"use client";

import { useState } from "react";
import { Schedule } from "@/lib/types";
import { findFocusDayIndex } from "@/lib/schedule-dates";
import ScheduleHeader from "./ScheduleHeader";
import JourneyRail from "./JourneyRail";
import DayNav from "./DayNav";
import DayCard from "./DayCard";

export default function ScheduleView({ schedule }: { schedule: Schedule }) {
  const { days } = schedule;
  const [focusIndex, setFocusIndex] = useState(() => findFocusDayIndex(days));
  const [viewAll, setViewAll] = useState(false);

  const focusDay = days[focusIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <ScheduleHeader schedule={schedule} />

      <div className="mb-8">
        <JourneyRail
          days={days}
          activeDayNumber={focusDay.dayNumber}
          onSelect={(dayNumber) => {
            setViewAll(false);
            setFocusIndex(days.findIndex((d) => d.dayNumber === dayNumber));
          }}
        />
      </div>

      <div className="mb-5">
        <DayNav
          currentDayNumber={focusDay.dayNumber}
          totalDays={days.length}
          viewAll={viewAll}
          onPrev={() => setFocusIndex((i) => Math.max(0, i - 1))}
          onNext={() => setFocusIndex((i) => Math.min(days.length - 1, i + 1))}
          onToggleViewAll={() => setViewAll((v) => !v)}
        />
      </div>

      {viewAll ? (
        <div className="space-y-5">
          {days.map((day) => (
            <DayCard key={day.id} day={day} muted />
          ))}
        </div>
      ) : (
        <DayCard day={focusDay} />
      )}
    </div>
  );
}
