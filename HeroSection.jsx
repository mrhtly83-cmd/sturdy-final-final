import React from "react";
import { AdjustmentsHorizontalIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Personalized Scripts",
    description: "Tailor calming language to the child's age, neurotype, and current struggle.",
    icon: SparklesIcon,
  },
  {
    title: "Tone Slider",
    description: "Lean gentle or firm so every sentence feels like it came from you.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    title: "Save + Co-Parent",
    description: "Store scripts + sync tone with the other caregiver in one tap.",
    icon: HeartIcon,
  },
];

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100vh] w-full items-center justify-center px-6 py-16 md:px-8">
      {/* Background video would go here - currently using gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sunset-start via-orange-500 to-sunset-end" />
      
      {/* Centered content container with max-width */}
      <div className="mx-auto w-full max-w-[800px] space-y-10 text-center">
        {/* Headline and subtitle section */}
        <div className="space-y-6">
          <p className="font-body text-sm uppercase tracking-[0.56em] text-white/80">
            Sturdy Parent
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Design the words that calm your home.
          </h1>
          <p className="font-body mx-auto max-w-[600px] text-base text-white/90 md:text-lg">
            Just-in-time, science-backed scripts tuned to your child, situation, and tone so you can respond—not
            react.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4">
          <button className="font-body min-w-[220px] rounded-full border border-white/50 bg-white/80 px-10 py-4 text-base font-semibold uppercase tracking-[0.24em] text-black shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:bg-white">
            Start Your Trial
          </button>
        </div>

        {/* Feature cards with premium blur-glass effect */}
        <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
                <p className="font-body text-sm text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
