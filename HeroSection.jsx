import React from "react";

export default function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 rounded-[36px] bg-gradient-to-br from-sunset-start via-orange-500 to-sunset-end px-6 pt-16 pb-24 text-center shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4">
        <p className="font-body text-sm uppercase tracking-[0.56em] text-white/80">
          Sturdy Parent
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl">
          Design the words that calm your home.
        </h1>
        <p className="font-body max-w-3xl text-base text-white/90 md:text-lg">
          Just-in-time, science-backed scripts tuned to your child, situation, and tone so you can respond—not
          react.
        </p>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-center">
          <button className="font-body min-w-[220px] rounded-full border border-white/50 bg-white/80 px-10 py-4 text-base font-semibold uppercase tracking-[0.24em] text-black shadow-lg shadow-black/40 transition hover:-translate-y-0.5">
            Start Your Trial
          </button>
          <span className="font-body text-sm uppercase tracking-[0.4em] text-white/80">
            Scroll ↓
          </span>
        </div>
      </div>
      <div className="mt-12 w-full border-t border-white/10 pt-6">
        <p className="font-body text-xs uppercase tracking-[0.6em] text-white/60">
          Fresh scripts await below
        </p>
      </div>
    </section>
  );
}
