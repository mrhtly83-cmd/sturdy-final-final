import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

export default function Explore() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>
        Systems designed to improve your daily life.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌅 Morning Routine</Text>
        <Text style={styles.cardText}>
          Start your day with clarity and intention.
        </Text>
        <Text style={styles.pro}>PRO</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Weekly Planning</Text>
        <Text style={styles.cardText}>
          Plan smarter weeks, not busier ones.
        </Text>
        <Text style={styles.pro}>PRO</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Goal Tracker</Text>
        <Text style={styles.cardText}>
          Break goals into achievable actions.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.textSize.xl,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardText: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
    lineHeight: 20,
  },
  pro: {
    marginTop: 10,
    alignSelf: "flex-start",
    color: theme.colors.accent,
    fontSize: theme.textSize.xs,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
