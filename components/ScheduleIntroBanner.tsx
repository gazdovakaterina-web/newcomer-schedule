"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, X } from "lucide-react";

const STORAGE_KEY = "schedule-intro-dismissed-v1";

export default function ScheduleIntroBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable — just skip the banner rather than error.
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to do if storage isn't available — the banner still
      // closes for this session, it just may reappear next visit.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-xl bg-white border border-dark-teal/10 shadow-card p-4 flex items-start gap-3">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-sm text-dark-teal">
          <Clock className="w-4 h-4 text-teal shrink-0" strokeWidth={2.25} />
          <span>
            <strong className="font-medium">Today&rsquo;s Schedule</strong> — sessions with a set time.
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-teal">
          <CheckCircle2 className="w-4 h-4 text-teal shrink-0" strokeWidth={2.25} />
          <span>
            <strong className="font-medium">Complete Anytime Today</strong> — no set time, fit it in whenever.
          </span>
        </div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-dark-teal/30 hover:text-dark-teal transition"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
}
