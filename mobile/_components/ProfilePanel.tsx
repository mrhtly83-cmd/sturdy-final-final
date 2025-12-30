import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    padding: 24,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 4,
  },
  email: {
    color: "#888888",
    fontSize: 14,
  },
});
