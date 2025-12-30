import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../../src/styles/theme";

export default function PrivacyPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: December 30, 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide directly to us, such as when you create an account,
          use our services, or contact us for support.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect to provide, maintain, and improve our services,
          and to communicate with you about updates and features.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate security measures to protect your personal information
          against unauthorized access, alteration, or destruction.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to access, update, or delete your personal information at any time.
          Contact us if you wish to exercise these rights.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@sturdy.app
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
