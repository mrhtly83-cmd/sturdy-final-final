import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PremiumPaywall from "./_components/PremiumPaywall";

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PremiumPaywall
        onSubscribeMonthly={() => Alert.alert("Subscribe", "Monthly subscription placeholder")}
        onSubscribeLifetime={() => Alert.alert("Subscribe", "Lifetime subscription placeholder")}
      />

      <TouchableOpacity style={styles.freeBtn} onPress={() => router.back()}>
        <Text style={styles.freeText}>Continue with Free</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  freeBtn: { padding: 14, borderRadius: 999, borderWidth: 1, alignItems: "center", marginBottom: 12 },
  freeText: { fontSize: 16, fontWeight: "600" },
});
