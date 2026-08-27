"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DayNav({
  label,
  viewAll,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onToggleViewAll,
}: {
  label: string;
  viewAll: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleViewAll: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={onPrev}
        disabled={viewAll || isFirst}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-dark-teal disabled:opacity-30 disabled:pointer-events-none hover:bg-dark-teal/5 transition"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="text-sm font-medium text-dark-teal/70 tabular-nums">{label}</div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleViewAll}
          className="text-sm font-medium text-teal underline-offset-4 hover:underline"
        >
          {viewAll ? "Focus on one day" : "View all days"}
        </button>

        <button
          onClick={onNext}
          disabled={viewAll || isLast}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-dark-teal disabled:opacity-30 disabled:pointer-events-none hover:bg-dark-teal/5 transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
