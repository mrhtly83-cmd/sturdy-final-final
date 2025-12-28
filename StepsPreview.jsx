import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose the child",
    description: "Anchor every script with a trusted profile so the voice feels familiar.",
  },
  {
    number: "02",
    title: "Fine-tune tone",
    description: "Adjust gentle → firm and tell us the neurotype so the words land right.",
  },
  {
    number: "03",
    title: "Describe the moment",
    description: "Capture the struggle, then grab the calm words and say them out loud.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function StepsPreview() {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <div className="space-y-2 text-center">
          <p className="font-body text-sm uppercase tracking-[0.4em] text-emerald-200/80">
            How it works
          </p>
          <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
            Calm language in three thoughtful steps.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-3xl transition hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(79,211,184,0.45)] hover:brightness-110"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={cardVariants}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-heading text-3xl font-bold text-emerald-200">{step.number}</span>
              <h3 className="font-heading text-2xl font-semibold text-white">{step.title}</h3>
              <p className="font-body text-base text-white/75">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
