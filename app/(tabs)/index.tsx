import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../src/styles/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1440", "#0B0F17"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroKicker}>Today’s Focus</Text>
        <Text style={styles.heroTitle}>Make today meaningful.</Text>
        <Text style={styles.heroSub}>
          Progress comes from clarity, not pressure.
        </Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Set today’s intention</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily progress</Text>
          <Text style={styles.cardValue}>0% completed</Text>
          <Text style={styles.cardHint}>One focused action is enough to start.</Text>
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>Add task</Text>
            <Text style={styles.smallCardHint}>Small wins matter</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>Plan week</Text>
            <Text style={styles.smallCardHint}>Zoom out</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },

  hero: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroKicker: {
    color: "#B9A7FF",
    fontSize: theme.textSize.sm,
    fontWeight: "800",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
    lineHeight: 40,
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: theme.textSize.md,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    width: "80%",
  },
  primaryButtonText: {
    color: "#1A1440",
    fontSize: theme.textSize.md,
    fontWeight: "900",
  },

  content: { padding: theme.spacing.lg },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    color: theme.colors.muted,
    fontSize: theme.textSize.sm,
    marginBottom: 8,
    fontWeight: "700",
  },
  cardValue: {
    color: theme.colors.text,
    fontSize: theme.textSize.lg,
    fontWeight: "900",
    marginBottom: 6,
  },
  cardHint: { color: theme.colors.muted, fontSize: theme.textSize.sm },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: "900",
    marginBottom: theme.spacing.sm,
  },
  row: { flexDirection: "row", gap: theme.spacing.sm },
  smallCard: {
    flex: 1,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  smallCardTitle: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: "800",
    marginBottom: 4,
  },
  smallCardHint: { color: theme.colors.muted, fontSize: theme.textSize.sm },
});
