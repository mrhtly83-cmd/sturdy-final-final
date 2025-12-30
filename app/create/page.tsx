import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../src/styles/theme";

export default function CreatePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Script</Text>
      <Text style={styles.text}>Start creating your personalized parenting script.</Text>
      
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/(tabs)/create")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
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
  text: {
    color: theme.colors.muted,
    fontSize: theme.textSize.md,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: theme.textSize.md,
    fontWeight: "800",
  },
});
