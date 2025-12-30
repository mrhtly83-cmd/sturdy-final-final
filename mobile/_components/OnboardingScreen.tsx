import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

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
      {onContinue && (
        <Pressable style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    color: "#888888",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6B4EFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
