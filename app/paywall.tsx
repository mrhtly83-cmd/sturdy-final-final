import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock your Sturdy toolbox</Text>
      <Text style={styles.subtitle}>More support when you need it most.</Text>

      <View style={styles.benefits}>
        <Text style={styles.bullet}>• Save scripts to Journal</Text>
        <Text style={styles.bullet}>• Co-parent sync</Text>
        <Text style={styles.bullet}>• More scripts per month</Text>
      </View>

      <TouchableOpacity
        style={styles.freeBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.freeText}>Continue with Free</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.upgradeBtn}
        onPress={() => Alert.alert("Upgrade", "Upgrade flow placeholder")}
      >
        <Text style={styles.upgradeText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", marginBottom: 18 },
  benefits: { marginBottom: 24 },
  bullet: { fontSize: 15, marginBottom: 6 },
  freeBtn: { padding: 14, borderRadius: 999, borderWidth: 1, alignItems: "center", marginBottom: 12 },
  freeText: { fontSize: 16, fontWeight: "600" },
  upgradeBtn: { padding: 14, borderRadius: 999, backgroundColor: "#4dd0a1", alignItems: "center" },
  upgradeText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
