import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HookScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>This is harder than it looks.</Text>
      <Text style={styles.subhead}>
        When feelings spike, words can feel out of reach. We’ll help you find
        simple language you can actually say.
      </Text>

      <Text style={styles.prompt}>Do you relate?</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => router.push("/quiz/child")}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>Yes — show me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.ghost]}
          onPress={() => router.push("/quiz/child")}
        >
          <Text style={styles.buttonText}>Not right now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  subhead: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  prompt: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  row: { width: "100%", gap: 12 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primary: { backgroundColor: "#4dd0a1" },
  ghost: { backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#e6e6e6" },
  buttonText: { fontSize: 16, color: "#111", fontWeight: "700" },
  primaryText: { color: "#fff" },
});
