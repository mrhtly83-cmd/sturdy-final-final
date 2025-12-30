import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../../src/styles/theme";

export default function ManifestoContent() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Our Manifesto</Text>
      <Text style={styles.text}>
        We believe in the power of gentle words and strong connections.
        Sturdy helps parents create meaningful moments with their children.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.textSize.xl,
    fontWeight: "900",
    marginBottom: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    lineHeight: 24,
  },
});
