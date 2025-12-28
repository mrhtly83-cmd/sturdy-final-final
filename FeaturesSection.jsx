import React from "react";
import { motion } from "framer-motion";
import { AdjustmentsHorizontalIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Tone Slider",
    description: "Shift from gentle reassurance to firm guidance without losing your calm.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    title: "Connection-first scripts",
    description: "Each message highlights attachment science so you stay aligned with your child.",
    icon: SparklesIcon,
  },
  {
    title: "Save & co-parent",
    description: "Keep favorite scripts close and share tone with other caregivers in seconds.",
    icon: HeartIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="space-y-2 text-center md:text-left">
          <p className="font-body text-sm uppercase tracking-[0.4em] text-emerald-200/80">
            Features
          </p>
          <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
            Built for caregivers who respond with compassion.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
