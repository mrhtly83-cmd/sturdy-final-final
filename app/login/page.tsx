import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../src/styles/theme";

export default function LoginPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.text}>Sign in to access your account.</Text>
      
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/(auth)/sign-in")}
      >
        <Text style={styles.buttonText}>Go to Sign In</Text>
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
