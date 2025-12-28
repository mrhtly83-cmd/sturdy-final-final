import React from "react";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import SpecialSection from "./SpecialSection";
import StepsPreview from "./StepsPreview";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sunset-start via-[#05040b] to-sunset-end px-4 py-8 font-body text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/40 via-white/0 to-transparent" />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 md:gap-16">
        <HeroSection />
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500/80" />
        </div>
        <FeaturesSection />
        <SpecialSection />
        <StepsPreview />
      </main>
    </div>
  );
}
