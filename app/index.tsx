// app/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function IntroScreen() {
  const [isMuted, setIsMuted] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require("../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted={isMuted}
      />

      {/* Tap anywhere to unmute */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setIsMuted((m) => !m)}
      />

      {/* Dark overlay */}
      <LinearGradient
        colors={[
          "rgba(11,15,23,0.25)",
          "rgba(11,15,23,0.65)",
          "rgba(11,15,23,0.95)",
        ]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Brand */}
        <Text style={styles.brand}>STURDY</Text>

        {/* Headline */}
        <Text style={styles.headline}>
          When your child is melting down and you don’t know what to say —
          we help you find the words.
        </Text>

        {/* Subhead */}
        <Text style={styles.subhead}>
          Calm, science-backed scripts designed for real parenting moments.
        </Text>

        {/* CTA */}
        <Pressable
          style={styles.cta}
          onPress={() => router.push("/quiz/child")}
        >
          <BlurView intensity={20} tint="dark" style={styles.ctaGlass}>
            <Text style={styles.ctaText}>Help me find the words</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </BlurView>
        </Pressable>

        {/* Unmute hint */}
        <Text style={styles.hint}>
          {isMuted ? "Tap anywhere to unmute" : "Sound on"}
        </Text>

        {/* Skip */}
        {showSkip && (
          <Pressable
            style={styles.skip}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.skipText}>Skip intro</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          Built for big feelings. No judgment. Just support.
        </Text>
      </View>
    </View>
  );
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
});
