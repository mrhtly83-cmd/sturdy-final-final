// components/FeatureCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type FeatureCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  sub: string;
  rightLabel?: string;
  locked?: boolean;
};

export default function FeatureCard({
  icon,
  title,
  sub,
  rightLabel,
  locked,
}: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={["rgba(124,92,255,0.85)", "rgba(77,208,161,0.55)"]}
        style={styles.iconBg}
      />
      <Ionicons name={icon} size={20} color="white" />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      {locked && <Ionicons name="lock-closed" size={16} color="#aaa" />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161b22",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBg: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    left: 12,
    top: 12,
  },
  textWrap: {
    marginLeft: 48,
    flex: 1,
  },
  title: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  sub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 4,
  },
});
