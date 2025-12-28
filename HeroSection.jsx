import React from "react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[420px] w-full flex-col items-center justify-center gap-6 rounded-[36px] border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
      <div className="pointer-events-none absolute inset-2 rounded-[30px] border border-white/5" />
      <div className="relative z-10 max-w-3xl space-y-6">
        <p className="font-body text-sm uppercase tracking-[0.5em] text-emerald-200/90">
          Sturdy Parent
        </p>
        <h1 className="font-heading text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
          Design the words that calm your home.
        </h1>
        <p className="font-body text-base text-white/80 md:text-lg">
          Get just-in-time, science-backed scripts tuned to your child’s age,
          neurotype, tone, and the exact moment you are navigating together.
        </p>
        <button className="font-body w-full rounded-full border border-white/40 bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-8 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/40 transition hover:scale-[1.01] hover:shadow-2xl">
          Start Your Trial
        </button>
      </div>
    </section>
  );
}
