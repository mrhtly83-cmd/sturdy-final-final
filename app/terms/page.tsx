import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../../src/styles/theme";

export default function TermsPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: December 30, 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using Sturdy, you accept and agree to be bound by the terms
          and conditions of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.text}>
          You agree to use our service only for lawful purposes and in accordance with
          these Terms of Service.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account and
          password. You agree to accept responsibility for all activities that occur
          under your account.
        </Text>

        <Text style={styles.sectionTitle}>4. Content</Text>
        <Text style={styles.text}>
          Our service allows you to create and store content. You retain all rights
          to any content you submit, post or display on or through the service.
        </Text>

        <Text style={styles.sectionTitle}>5. Termination</Text>
        <Text style={styles.text}>
          We may terminate or suspend your account and access to the service immediately,
          without prior notice, for any reason whatsoever.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact</Text>
        <Text style={styles.text}>
          For any questions about these Terms of Service, please contact us at
          support@sturdy.app
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
    marginBottom: theme.spacing.sm,
  },
  lastUpdated: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.textSize.lg,
    fontWeight: "700",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
});
