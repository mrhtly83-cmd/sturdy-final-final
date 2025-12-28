import React, { useState } from "react";
import ScriptPreview from "./ScriptPreview";

const momentOptions = [
  "Toy broke in front of sibling",
  "Homework meltdown",
  "Bedtime resistance",
  "Power struggle over screen time",
];

export default function StepTabTwo() {
  const [selectedMoment, setSelectedMoment] = useState(momentOptions[0]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isQuick, setIsQuick] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [quickMode, setQuickMode] = useState(false);

  const handleSubmit = () => {
    setShowPreview(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-xl bg-white/10 p-6 text-white shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
      <div className="space-y-2 text-center">
        <p className="font-body text-sm uppercase tracking-[0.4em] text-emerald-200/80">
          Step 3 of 3
        </p>
        <h2 className="font-heading text-3xl font-bold text-white">Let’s find the words together.</h2>
        <p className="font-body text-base text-white/75">
          Capture the emotional snapshot so your script lands with care.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.4em] text-emerald-200/80">
                Need a calmer script fast?
              </p>
              <p>Use this when your brain is overloaded.</p>
            </div>
            <button
              type="button"
              className={`h-8 w-16 rounded-full border ${quickMode ? "border-emerald-400 bg-emerald-500/40" : "border-white/20 bg-white/10"}`}
              onClick={() => setQuickMode((prev) => !prev)}
            >
              <span
                className={`block h-full w-1/2 rounded-full bg-white transition-all ${quickMode ? "ml-1" : "ml-[2px]"}`}
              />
            </button>
          </div>
        </div>
        <label className="font-body text-sm uppercase tracking-[0.3em] text-white/70">
          What’s the moment your child is stuck in?
        </label>
        <select
          className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white outline-none transition focus:border-emerald-400"
          value={selectedMoment}
          onChange={(e) => setSelectedMoment(e.target.value)}
        >
          {momentOptions.map((option) => (
            <option key={option} value={option} className="bg-[#05040c] text-white">
              {option}
            </option>
          ))}
        </select>

        <label className="font-body text-sm uppercase tracking-[0.3em] text-white/70">
          Add context (optional)
        </label>
        {!quickMode && (
          <textarea
            className="min-h-[120px] w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
            placeholder="Include the words your child used or any sensory detail."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 md:flex-row">
        <div className="text-sm font-medium text-white/80">
          Mode
          <span className="ml-2 text-xs uppercase tracking-[0.4em] text-white/50">
            {isQuick ? "Quick version" : "Full script"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isQuick ? "bg-emerald-400 text-black" : "bg-white/15 text-white"
            }`}
            onClick={() => setIsQuick(true)}
          >
            Quick
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isQuick ? "bg-white/15 text-white" : "bg-emerald-400 text-black"
            }`}
            onClick={() => setIsQuick(false)}
          >
            Full
          </button>
        </div>
      </div>

      <button
        className="rounded-2xl bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-6 py-3 text-base font-semibold uppercase tracking-[0.3em] text-black shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5"
        onClick={handleSubmit}
      >
        ✨ Get My Script
      </button>

      {showPreview && <ScriptPreview isPremium={false} />}
    </div>
  );
}
