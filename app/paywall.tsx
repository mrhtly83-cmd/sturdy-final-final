import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import PremiumPaywall from "./_components/PremiumPaywall";

export default function PaywallScreen() {
  const router = useRouter();

  const openPaymentLink = async (link?: string | null) => {
    if (!link) {
      Alert.alert(
        "Payment link not configured",
        "Add your Stripe Payment Link URLs to the .env file first."
      );
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(link);
    } catch (error: any) {
      Alert.alert("Unable to open checkout", error?.message ?? "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <PremiumPaywall
        onSubscribeWeekly={() => openPaymentLink(process.env.EXPO_PUBLIC_STRIPE_WEEKLY_LINK)}
        onSubscribeMonthly={() => openPaymentLink(process.env.EXPO_PUBLIC_STRIPE_MONTHLY_LINK)}
        onSubscribeLifetime={() => openPaymentLink(process.env.EXPO_PUBLIC_STRIPE_LIFETIME_LINK)}
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
