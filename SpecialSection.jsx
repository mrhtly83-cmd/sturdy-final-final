import React from "react";

const highlights = [
  "Just-in-time scripts built on attachment + behavior science.",
  "Tone + neurotype controls so every sentence feels like yours.",
  "Share, save, and reflect with a journal tailored to co-parents.",
];

export default function SpecialSection() {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            ✨ What Makes Sturdy Parent Special
          </h2>
          <p className="font-body text-lg text-white/80">
            Gentle, personalized guidance when emotions run high.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-[24px] border border-white/10 bg-gradient-to-b from-white/15 via-white/5 to-white/0 p-5 text-sm text-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
            >
              <p>{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
