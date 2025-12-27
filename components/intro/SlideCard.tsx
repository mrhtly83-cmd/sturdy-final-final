// components/intro/SlideCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Slide = {
  title: string;
  body: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  pill: string;
};
export default function SlideCard({ slide }: { slide: Slide }) {
  return (
    <BlurView intensity={26} tint="dark" style={styles.slideCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.11)", "rgba(255,255,255,0.02)", "rgba(0,0,0,0.12)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.slideBorder} />

      <View style={styles.slideTopRow}>
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={["rgba(124,92,255,0.85)", "rgba(77,208,161,0.55)"]}
            style={styles.iconBg}
          />
          <Ionicons name={slide.icon} size={18} color="white" />
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillText}>{slide.pill}</Text>
        </View>
      </View>

      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={styles.slideBody}>{slide.body}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  slideCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  slideBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  slideTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: {
    ...StyleSheet.absoluteFillObject,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  pillText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  slideTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  slideBody: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
});
