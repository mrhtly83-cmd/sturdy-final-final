import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Root page component for web platform
 * This serves as the landing page when accessing the app via web
 */
export default function RootPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1440", "#0B0F17"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.title}>Welcome to Sturdy</Text>
        <Text style={styles.subtitle}>
          Gentle words. Stronger moments.
        </Text>
        <Text style={styles.description}>
          Create personalized parenting scripts that help you connect with your children
          through calm, thoughtful conversations.
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>

          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.push("/about")}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  hero: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    color: "#B9A7FF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  description: {
    color: "rgba(255,255,255,0.8)",
    fontSize: theme.textSize.md,
    textAlign: "center",
    maxWidth: 600,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
  },
  primaryButtonText: {
    color: "#1A1440",
    fontSize: theme.textSize.md,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: theme.textSize.md,
    fontWeight: "900",
  },
});
