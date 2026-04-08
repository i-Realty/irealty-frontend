"use client";

import React from "react";

interface ProgressPillProps {
  /** Current step number (1-based) */
  step: number;
  /** Total number of steps, defaults to 3 */
  total?: number;
}

const LABELS = ["Service Type", "Account Info", "Verify"];

/**
 * Signup wizard progress indicator.
 * Shows current step label and a progress bar.
 */
export default function ProgressPill({ step, total = 3 }: ProgressPillProps) {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-3.5 mb-3 sm:mb-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[#8E98A8]">Step {step}/{total}</span>
        <span className="text-sm font-bold dark:text-gray-100">{LABELS[step - 1]}</span>
        <div className="flex-1" />
        <div className="w-40">
          <div className="h-1.5 bg-indigo-50 dark:bg-gray-700 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
