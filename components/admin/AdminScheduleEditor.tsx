"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Schedule } from "@/lib/types";
import { buildTrainingDayNumbers } from "@/lib/schedule-dates";
import AdminDayCard from "./AdminDayCard";

export default function AdminScheduleEditor({ schedule }: { schedule: Schedule }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const trainingDayNumbers = buildTrainingDayNumbers(schedule.days);

  async function handleAddDay() {
    setAdding(true);
    const supabase = createSupabaseBrowserClient();
    const nextDayNumber = schedule.days.length + 1;
    const lastDate =
      schedule.days.length > 0 ? schedule.days[schedule.days.length - 1].date : new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("training_days").insert({
      schedule_id: schedule.id,
      day_number: nextDayNumber,
      title: `Day ${nextDayNumber}`,
      date: lastDate,
      sort_order: nextDayNumber,
    });

    setAdding(false);

    if (error) {
      alert(`Couldn't add day: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {schedule.days.map((day) => (
        <AdminDayCard
          key={day.id}
          day={day}
          trainingDayNumber={trainingDayNumbers[day.id] ?? null}
        />
      ))}

      <button
        onClick={handleAddDay}
        disabled={adding}
        className="w-full flex items-center justify-center gap-2 rounded-card border-2 border-dashed border-dark-teal/15 py-5 text-dark-teal/60 font-medium hover:border-teal/40 hover:text-teal transition disabled:opacity-50"
      >
        <Plus className="w-4 h-4" strokeWidth={2.25} />
        {adding ? "Adding…" : "Add training day"}
      </button>
    </div>
  );
}
