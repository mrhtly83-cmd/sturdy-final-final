import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../src/styles/theme";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#132038", theme.colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>

        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. Your payment was processed successfully.
        </Text>

        <Pressable style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Return Home</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.xl,
    justifyContent: "center",
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: "center",
    gap: theme.spacing.md,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  badgeText: {
    color: "#0B0F17",
    fontSize: 28,
    fontWeight: "900",
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.textSize.xl,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.textSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonText: {
    color: "#0B0F17",
    fontSize: theme.textSize.md,
    fontWeight: "800",
  },
});
