import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const tabs = ["Behavior", "Learning", "Social"] as const;
type IconName =
  | "trail-sign-outline"
  | "map-outline"
  | "leaf-outline"
  | "shield-checkmark-outline";
const workItems: { title: string; subtitle: string; icon: IconName }[] = [
  { title: "Executive Function", subtitle: "Focus & Messiness", icon: "trail-sign-outline" },
  { title: "Sturdy Leadership", subtitle: "Boundaries", icon: "map-outline" },
  { title: "Resilient Learner", subtitle: "Grades & Giving Up", icon: "leaf-outline" },
  { title: "Social Wiring", subtitle: "Bullying / Peers", icon: "shield-checkmark-outline" },
];

const palette = {
  background: "#F8FAFC",
  text: "#0F172A",
  muted: "#94A3B8",
  accent: "#CA8A04",
  surface: "rgba(255,255,255,0.78)",
  border: "rgba(15,23,42,0.08)",
};
const CARD_BASIS = "48%";

export default function AnimatedIntro() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Behavior");
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const pulseOpacity = pulse.interpolate({
    inputRange: [1, 1.12],
    outputRange: [0.55, 0],
  });

  return (
    <View style={styles.container}>
      <Video
        source={require("../../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />

      <LinearGradient
        colors={["rgba(248,250,252,0.92)", "rgba(248,250,252,0.82)", "rgba(248,250,252,0.65)"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.brandName}>STURDY</Text>
              <Text style={styles.tagline}>Be the Pilot, Not the Passenger.</Text>
            </View>
          </View>

          <Pressable style={styles.profileButton}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>10</Text>
            </View>
            <Text style={styles.profileText}>Profile: Emma</Text>
            <Text style={styles.caret}>▾</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroOverlay} />
          <Animated.View
            style={[styles.pulseHalo, { transform: [{ scale: pulse }], opacity: pulseOpacity }]}
          />
          <View style={styles.pulseCore}>
            <Ionicons name="warning-outline" size={28} color={palette.text} />
          </View>
          <Text style={styles.heroTitle}>I NEED HELP NOW</Text>
          <Text style={styles.heroSubtitle}>Script me through a crisis</Text>
          <Text style={styles.heroNote}>The SOS Button · Sticky Hero</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>The Work</Text>
            <View style={styles.tabRow}>
              {tabs.map((tab) => (
                <Pressable
                  key={tab}
                  style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.cardGrid}>
            {workItems.map((item, index) => (
              <View key={`${item.title}-${index}`} style={styles.workCard}>
                <View style={styles.workIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#fff" />
                </View>
                <View>
                  <Text style={styles.workTitle}>{item.title}</Text>
                  <Text style={styles.workSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.practiceCard}>
          <View>
            <Text style={styles.practiceLabel}>Daily Practice</Text>
            <Text style={styles.practiceTitle}>Keep the repair streak alive.</Text>
          </View>
          <View style={styles.practiceActions}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>+ Log a Rupture</Text>
            </Pressable>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>View Repair Streak: 12 🔥</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerItem}>Home</Text>
          <Text style={styles.footerItem}>Chat with Sturdy</Text>
          <Text style={styles.footerItem}>Profile</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoWrap: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  logo: {
    height: "80%",
    width: "80%",
  },
  brandName: {
    color: palette.text,
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: "800",
  },
  tagline: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  profileBadge: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBadgeText: {
    color: palette.text,
    fontWeight: "800",
    fontSize: 12,
  },
  profileText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  caret: {
    color: palette.muted,
    fontSize: 14,
    marginLeft: 2,
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  pulseHalo: {
    position: "absolute",
    top: 26,
    height: 96,
    width: 96,
    borderRadius: 48,
    backgroundColor: palette.accent,
    opacity: 0.4,
  },
  pulseCore: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  heroTitle: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
    color: palette.text,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: palette.muted,
  },
  heroNote: {
    marginTop: 16,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
    color: palette.muted,
    textTransform: "uppercase",
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionLabel: {
    color: palette.muted,
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 14,
    textTransform: "uppercase",
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.14)",
  },
  tabButtonActive: {
    backgroundColor: palette.text,
  },
  tabText: {
    color: palette.muted,
    fontWeight: "700",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#fff",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  workCard: {
    flexBasis: CARD_BASIS,
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  workIconWrap: {
    height: 44,
    width: 44,
    borderRadius: 14,
    backgroundColor: palette.text,
    alignItems: "center",
    justifyContent: "center",
  },
  workTitle: {
    color: palette.text,
    fontWeight: "800",
    fontSize: 14,
  },
  workSubtitle: {
    color: palette.muted,
    fontWeight: "600",
    fontSize: 13,
  },
  practiceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  practiceLabel: {
    color: palette.muted,
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  practiceTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },
  practiceActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondaryButtonText: {
    color: palette.text,
    fontWeight: "800",
    fontSize: 13,
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: palette.accent,
  },
  primaryButtonText: {
    color: palette.text,
    fontWeight: "900",
    fontSize: 13,
  },
  footer: {
    marginTop: 8,
    padding: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  footerItem: {
    color: palette.text,
    fontWeight: "800",
    fontSize: 13,
  },
});
