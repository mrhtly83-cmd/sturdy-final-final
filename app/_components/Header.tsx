import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sturdy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.textSize.xl,
    fontWeight: "900",
  },
});
