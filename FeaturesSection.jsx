import React from "react";
import { motion } from "framer-motion";
import { AdjustmentsHorizontalIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Personalized Scripts",
    description: "Tailor calming language to the child’s age, neurotype, and current struggle.",
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

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturesSection() {
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={cardVariants}
                transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              >
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="flex"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={cardVariants}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <FeatureCard
              icon={features[2].icon}
              title={features[2].title}
              description={features[2].description}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
