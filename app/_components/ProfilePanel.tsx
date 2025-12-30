import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

interface ProfilePanelProps {
  email?: string;
  userName?: string;
}

export default function ProfilePanel({ email, userName }: ProfilePanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {userName && <Text style={styles.text}>{userName}</Text>}
      {email && <Text style={styles.email}>{email}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.textSize.lg,
    fontWeight: "900",
    marginBottom: theme.spacing.sm,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    marginBottom: theme.spacing.xs,
  },
  email: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
  },
});
