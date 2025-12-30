import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";
import PrimaryButton from "./PrimaryButton";

interface OnboardingScreenProps {
  title?: string;
  description?: string;
  onContinue?: () => void;
}

export default function OnboardingScreen({ 
  title = "Welcome to Sturdy",
  description = "Let's get started on your parenting journey.",
  onContinue 
}: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onContinue && <PrimaryButton title="Continue" onPress={onContinue} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  description: {
    color: theme.colors.muted,
    fontSize: theme.textSize.md,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
});
