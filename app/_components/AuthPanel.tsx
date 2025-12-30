import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

export default function AuthPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Auth Panel Component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
  },
});
