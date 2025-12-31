import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PremiumCard from "./_components/PremiumCard";

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock your Sturdy toolbox</Text>
      <Text style={styles.subtitle}>More support when you need it most.</Text>

      <PremiumCard onUpgrade={() => Alert.alert("Upgrade", "Upgrade flow placeholder")} />

      <TouchableOpacity
        style={styles.freeBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.freeText}>Continue with Free</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", marginBottom: 18 },
  freeBtn: { padding: 14, borderRadius: 999, borderWidth: 1, alignItems: "center", marginBottom: 12 },
  freeText: { fontSize: 16, fontWeight: "600" },
});
