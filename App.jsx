import React from "react";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import StepsPreview from "./StepsPreview";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sunset-start via-[#05040b] to-sunset-end font-body text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/30 via-white/0 to-transparent" />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 md:py-20">
        <HeroSection />
        <FeaturesSection />
        <StepsPreview />
      </main>
    </div>
  );
}
