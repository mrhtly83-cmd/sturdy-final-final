import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../../src/styles/theme";

export default function AboutPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About Sturdy</Text>
        <Text style={styles.text}>
          Sturdy is your partner in mindful parenting. We help you create meaningful 
          connections with your children through gentle words and calm scripts.
        </Text>
        <Text style={styles.text}>
          Our mission is to empower parents with tools that make every moment count.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: theme.spacing.lg,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
});
