import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2025 Sturdy. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  text: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
  },
});
