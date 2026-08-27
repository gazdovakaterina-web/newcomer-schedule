"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export type ViewMode = "focus" | "all" | "overview";

export default function DayNav({
  label,
  mode,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onSetMode,
}: {
  label: string;
  mode: ViewMode;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSetMode: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={onPrev}
        disabled={mode !== "focus" || isFirst}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-dark-teal disabled:opacity-30 disabled:pointer-events-none hover:bg-dark-teal/5 transition"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="text-sm font-medium text-dark-teal/70 tabular-nums">{label}</div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onSetMode(mode === "all" ? "focus" : "all")}
          className={`text-sm font-medium underline-offset-4 hover:underline ${
            mode === "all" ? "text-dark-teal" : "text-teal"
          }`}
        >
          All days
        </button>
        <span className="text-dark-teal/20 text-sm">|</span>
        <button
          onClick={() => onSetMode(mode === "overview" ? "focus" : "overview")}
          className={`text-sm font-medium underline-offset-4 hover:underline ${
            mode === "overview" ? "text-dark-teal" : "text-teal"
          }`}
        >
          Overview
        </button>

        <button
          onClick={onNext}
          disabled={mode !== "focus" || isLast}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-dark-teal disabled:opacity-30 disabled:pointer-events-none hover:bg-dark-teal/5 transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
