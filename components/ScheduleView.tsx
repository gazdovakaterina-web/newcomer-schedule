"use client";

import { useState } from "react";
import { Schedule } from "@/lib/types";
import { findFocusDayIndex, buildTrainingDayNumbers, countTrainingDays } from "@/lib/schedule-dates";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleIntroBanner from "./ScheduleIntroBanner";
import JourneyRail from "./JourneyRail";
import DayNav from "./DayNav";
import DayCard from "./DayCard";

export default function ScheduleView({ schedule }: { schedule: Schedule }) {
  const { days } = schedule;
  const [focusIndex, setFocusIndex] = useState(() => findFocusDayIndex(days));
  const [viewAll, setViewAll] = useState(false);

  const focusDay = days[focusIndex];
  const trainingDayNumbers = buildTrainingDayNumbers(days);
  const totalTrainingDays = countTrainingDays(days);
  const focusTrainingNumber = trainingDayNumbers[focusDay.id] ?? null;

  const navLabel = viewAll
    ? `${days.length} days`
    : focusTrainingNumber !== null
    ? `Day ${focusTrainingNumber} / ${totalTrainingDays}`
    : "Day off";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <ScheduleHeader schedule={schedule} />

      <ScheduleIntroBanner />

      <div className="mb-8">
        <JourneyRail
          days={days}
          trainingDayNumbers={trainingDayNumbers}
          activeDayId={focusDay.id}
          onSelect={(dayId) => {
            setViewAll(false);
            setFocusIndex(days.findIndex((d) => d.id === dayId));
          }}
        />
      </div>

      <div className="mb-5">
        <DayNav
          label={navLabel}
          viewAll={viewAll}
          isFirst={focusIndex === 0}
          isLast={focusIndex === days.length - 1}
          onPrev={() => setFocusIndex((i) => Math.max(0, i - 1))}
          onNext={() => setFocusIndex((i) => Math.min(days.length - 1, i + 1))}
          onToggleViewAll={() => setViewAll((v) => !v)}
        />
      </div>

      {viewAll ? (
        <div className="space-y-5">
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              trainingDayNumber={trainingDayNumbers[day.id] ?? null}
              muted
            />
          ))}
        </div>
      ) : (
        <DayCard day={focusDay} trainingDayNumber={focusTrainingNumber} />
      )}
    </div>
  );
}
