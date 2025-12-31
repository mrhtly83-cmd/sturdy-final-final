import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select child & situation",
    description: "Pick who needs support and the moment that needs words.",
  },
  {
    number: "02",
    title: "Get your script",
    description: "See connection-first words tuned to tone and neurotype.",
  },
  {
    number: "03",
    title: "Use, save, or share",
    description: "Practice, save to your journal, or sync with co-parent.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function StepsPreview() {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="mx-auto h-0.5 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 md:mx-0" />
          <p className="font-body text-sm uppercase tracking-[0.4em] text-emerald-200/80">
            Your 3-Step Calm Builder
          </p>
          <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
            How It Works
          </h2>
          <p className="font-body text-base text-white/80 md:text-lg">
            A simple, calming path to better moments.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-white/10 p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.12),0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition hover:-translate-y-1 hover:shadow-[0_45px_90px_rgba(79,211,184,0.4)]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={cardVariants}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-heading text-3xl font-bold text-emerald-200">{["①", "②", "③"][index]}</span>
              <h3 className="font-heading text-2xl font-semibold text-white">{step.title}</h3>
              <p className="font-body text-base text-white/75">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
