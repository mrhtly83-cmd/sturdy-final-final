import React from "react";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="relative flex min-h-[220px] flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-3xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-emerald-100">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-white">{title}</h3>
      <p className="font-body text-base text-white/75">{description}</p>
    </div>
  );
}
