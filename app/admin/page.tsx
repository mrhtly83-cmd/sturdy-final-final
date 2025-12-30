import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

export default function AdminPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.text}>Admin features coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
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
  },
});
