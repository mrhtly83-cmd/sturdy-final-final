// app/index.tsx

import AnimatedIntro from "@/components/intro/AnimatedIntro";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Built for parents",
    body: "Not every meltdown needs a manual. But when you need help, we’re here.",
    icon: "people",
    pill: "Start here",
  },
  {
    title: "Science, not shame",
    body: "Designed by psychologists. Backed by attachment research.",
    icon: "sparkles",
    pill: "Just real tools",
  },
  {
    title: "Tailored to your child",
    body: "Tone, context, and phrases calibrated to your unique family dynamic.",
    icon: "person",
    pill: "Your child is unique",
  },
];

export default function IntroScreen() {
  return <AnimatedIntro />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17" },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
    paddingBottom: 42,
  },

  brand: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 16,
  },

  headline: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 12,
  },

  subhead: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },

  cta: {
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },

  ctaGlass: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  hint: {
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginBottom: 10,
  },

  skip: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  skipText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },

  footer: {
    marginTop: 18,
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  dotsRow: {
  flexDirection: "row",
  alignSelf: "center",
  marginBottom: 24,
},
dot: {
  height: 6,
  borderRadius: 3,
  backgroundColor: "white",
  marginHorizontal: 4,
},
});
