import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PremiumCardProps {
  onUpgrade: () => void;
}

export default function PremiumCard({ onUpgrade }: PremiumCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialIcons name="stars" size={34} color="#FBB900" />
        <Text style={styles.title}>Sturdy Complete</Text>
      </View>
      <Text style={styles.subtitle}>
        Unlock unlimited scripts, audio playback, co-parent sync, and more!
      </Text>
      <View style={styles.features}>
        <View style={styles.featureRow}>
          <MaterialIcons name="check-circle" color="#36d4ba" size={22} />
          <Text style={styles.featureText}>Unlimited Scripts</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialIcons name="check-circle" color="#36d4ba" size={22} />
          <Text style={styles.featureText}>Audio Script Playback</Text>
        </View>
        <View style={styles.featureRow}>
          <MaterialIcons name="check-circle" color="#36d4ba" size={22} />
          <Text style={styles.featureText}>Co-Parent Sync</Text>
        </View>
      </View>
      <Pressable style={styles.cta} onPress={onUpgrade}>
        <Text style={styles.ctaText}>Upgrade for $4.99/mo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 28,
    padding: 22,
    margin: 16,
    borderWidth: 2,
    borderColor: "#FBB900",
    shadowColor: "#FBB900",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  title: { color: "#222", fontSize: 25, fontWeight: "700", marginLeft: 10 },
  subtitle: { color: "#434343", fontSize: 17, marginVertical: 9 },
  features: { margin: 14 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  featureText: { fontSize: 16, color: "#222", marginLeft: 6 },
  cta: { backgroundColor: "#36d4ba", borderRadius: 24, paddingVertical: 13, alignItems: "center", marginTop: 16 },
  ctaText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});
