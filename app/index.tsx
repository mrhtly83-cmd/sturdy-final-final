// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/* ------------------ Feature Card ------------------ */
function FeatureCard({
  icon,
  title,
  sub,
  rightLabel,
  locked,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  sub?: string;
  rightLabel?: string;
  locked?: boolean;
}) {
  return (
    <BlurView intensity={28} tint="dark" style={[styles.card, locked && styles.cardLocked]}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.10)",
          "rgba(255,255,255,0.03)",
          "rgba(0,0,0,0.08)",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />

      <View style={styles.cardRow}>
        <View style={styles.leftIcon}>
          <LinearGradient
            colors={["rgba(124,92,255,0.85)", "rgba(77,208,161,0.55)"]}
            style={styles.leftIconBg}
          />
          <Ionicons name={icon} size={18} color="white" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {!!sub && <Text style={styles.cardSub}>{sub}</Text>}
        </View>

        <View style={styles.rightMeta}>
          {!!rightLabel && <Text style={styles.rightLabel}>{rightLabel}</Text>}
          {locked && (
            <Ionicons
              name="lock-closed"
              size={18}
              color="rgba(255,255,255,0.65)"
            />
          )}
        </View>
      </View>
    </BlurView>
  );
}

/* ------------------ Sparkles ------------------ */
function Sparkles() {
  const sparkles = Array.from({ length: 18 });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sparkles.map((_, i) => {
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        return (
          <View
            key={i}
            style={[
              styles.sparkle,
              {
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                opacity: 0.12 + Math.random() * 0.22,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/* ------------------ Home Screen ------------------ */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require("../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Sparkles */}
      <Sparkles />

      {/* Dark overlay for readability */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.15)",
          "rgba(0,0,0,0.35)",
          "rgba(0,0,0,0.62)",
        ]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <LinearGradient
            colors={["rgba(124,92,255,0.95)", "rgba(77,208,161,0.75)"]}
            style={styles.logoBadge}
          />
          <Text style={styles.brand}>STURDY</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Let’s design the words that calm your home.
        </Text>

        <Text style={styles.subhead}>
          When emotions run high and you don’t know what to say — we help you find the words.
        </Text>

        <Text style={styles.subhead}>
          Answer a few quick questions to get calm, science-backed words you can use right away.
        </Text>

        <View style={{ height: 18 }} />

        {/* Cards */}
        <FeatureCard
          icon="people"
          title="Tell us about your child"
          sub="1 min."
          rightLabel="1 min"
        />

        <FeatureCard
          icon="lock-closed"
          title="Describe the hard moment"
          sub="Unlock after quiz"
          locked
        />

        <FeatureCard
          icon="sparkles"
          title="Save words that worked for you"
          sub="Tone + context tuned to your family."
          locked
        />

        <Text style={styles.takes}>Takes 2 minutes or less.</Text>

        {/* CTA */}
        <Pressable
          onPress={() => router.push("/quiz/child")}
          style={styles.ctaWrap}
        >
          <BlurView intensity={20} tint="dark" style={styles.ctaGlass}>
            <LinearGradient
              colors={[
                "rgba(77,208,161,0.65)",
                "rgba(124,92,255,0.35)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.ctaText}>Help me find the words</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.9)"
            />
          </BlurView>
        </Pressable>

        <Text style={styles.footer}>Built for big feelings and busy days.</Text>
        <Text style={styles.footer}>No judgment. Just support.</Text>
      </View>
    </View>
  );
}

/* ------------------ Styles ------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 34,
    justifyContent: "flex-end",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  logoBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    opacity: 0.9,
  },
  brand: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
  },

  headline: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  subhead: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 6,
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardLocked: { opacity: 0.72 },

  leftIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  leftIconBg: { ...StyleSheet.absoluteFillObject },

  cardTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "700",
  },
  cardSub: {
    marginTop: 3,
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    fontWeight: "600",
  },

  rightMeta: { alignItems: "flex-end", gap: 6, minWidth: 52 },
  rightLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    fontWeight: "700",
  },

  takes: {
    marginTop: 2,
    marginBottom: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "600",
  },

  ctaWrap: { marginTop: 6 },
  ctaGlass: {
    height: 56,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "600",
  },

  sparkle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,220,180,0.9)",
    shadowColor: "#ffffff",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
});
