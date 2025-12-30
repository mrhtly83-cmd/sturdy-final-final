import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import OnboardingScreen from "../_components/OnboardingScreen";
import { theme } from "../../src/styles/theme";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <OnboardingScreen
        title="Welcome to Sturdy"
        description="Let's get started on your parenting journey."
        onContinue={() => router.push("/(tabs)")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
