import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const sections = [
  {
    key: "use",
    title: "💬 Use These Words",
    body: "“I can see how hard that was for you. When your toy broke, it makes sense to feel angry and sad.”",
  },
  {
    key: "psychology",
    title: "💡 The Psychology",
    body: "Start with validation, then invite cooperation so the child feels seen instead of shamed.",
  },
  {
    key: "resist",
    title: "⚡ What If They Resist?",
    body: "Offer a pause and a simple choice: “Do you want to take a breath with me or take a two-minute break?”",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const toggleVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
};

export default function ScriptPreview({ isPremium = false }) {
  const [openSections, setOpenSections] = useState({
    use: true,
    psychology: false,
    resist: false,
  });
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleToggle = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        sections.map((section) => `${section.title}: ${section.body}`).join("\n\n")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(true);
    }
  };

  const handleShowUpgradeModal = () => {
    if (!isPremium) {
      setShowModal(true);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-emerald-200/80">
            Suggested Script
          </p>
          <h3 className="font-heading text-2xl font-semibold text-white">Fresh calm, ready to speak.</h3>
        </div>
        <div className="flex flex-col items-end">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60"
          >
            🗒️ Copy
          </button>
          {copied && <span className="text-[0.65rem] text-emerald-200/90">Copied!</span>}
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.key}
            className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]"
          >
            <button
              type="button"
              onClick={() => handleToggle(section.key)}
              className="flex w-full items-center justify-between text-left text-white"
            >
              <span className="font-heading text-lg font-semibold">{section.title}</span>
              <span className="text-sm text-white/60">{openSections[section.key] ? "-" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {openSections[section.key] && (
                <motion.div
                  key="content"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={toggleVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-3 overflow-hidden text-sm text-white/75"
                >
                  <p>{section.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={handleShowUpgradeModal}
          disabled={!isPremium}
          className={`flex-1 rounded-2xl bg-rose-400/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-500/40 transition hover:-translate-y-0.5 ${!isPremium ? "cursor-not-allowed opacity-60 hover:translate-y-0" : ""}`}
        >
          ❤️ Save to Journal
        </button>
        <button
          type="button"
          onClick={handleShowUpgradeModal}
          disabled={!isPremium}
          className={`flex-1 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 ${!isPremium ? "cursor-not-allowed opacity-60 hover:translate-y-0" : ""}`}
        >
          🔁 Share with Co-Parent
        </button>
        <div className="relative flex-1">
          <button
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5"
            type="button"
            onClick={handleShowUpgradeModal}
          >
            🔊 Play Audio
          </button>
          {!isPremium && (
            <>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-black/70 to-transparent" />
              <p className="mt-2 text-center text-[0.6rem] uppercase tracking-[0.5em] text-white/60">
                Available in Sturdy Complete (audio, co-parent sync, favorites + journal)
              </p>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-2xl">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 text-center shadow-[0_35px_90px_rgba(0,0,0,0.65)]">
            <button
              className="absolute right-4 top-4 text-white/70 transition hover:text-white"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <p className="font-heading text-xl font-semibold text-white">Want to hear the script read aloud?</p>
            <p className="font-body text-sm text-white/80">
              Upgrade to Sturdy Complete to unlock calming voice playback whenever you need it.
            </p>
            <button
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black shadow-lg shadow-emerald-500/40"
              onClick={() => setShowModal(false)}
            >
              Upgrade to Sturdy Complete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
