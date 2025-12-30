import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import SpecialSection from "./SpecialSection";
import StepsPreview from "./StepsPreview";

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 py-8 font-body text-white">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Sturdy Parents Sturdy children.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-1" />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/40 via-white/0 to-transparent z-2" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 md:gap-16">
        <HeroSection />
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500/80" />
        </div>
        <FeaturesSection />
        <SpecialSection />
        <div className="relative mx-auto w-full max-w-6xl py-8">
          <span className="pointer-events-none absolute inset-0 blur-2xl opacity-40" />
          <div className="mx-auto h-[1.5px] w-40 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        <StepsPreview />
      </main>
    </div>
  );
}