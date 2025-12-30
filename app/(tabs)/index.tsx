import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../src/styles/theme";

// Simulated scripts (replace with fetch logic)
const MOCK_SCRIPTS = [
  { id: "1", title: "Tantrum Support", snippet: "“I see you’re angry. That’s okay!”" },
  { id: "2", title: "Bedtime Calm", snippet: "“Let’s take a deep breath together.”" },
  { id: "3", title: "Screen Time Limits", snippet: "“We agreed, when the timer rings, screens go off.”" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [scripts, setScripts] = useState(MOCK_SCRIPTS);

  // Example: could fetch scripts here
  // useEffect(() => {
  //   ...fetch recent scripts (setScripts)
  // }, []);

  const handleCreateScript = () => navigation.navigate("create" as never);
  const handleViewScripts = () => {}; // Implement navigation to scripts history
  const handleScriptPress = (item: any) => {}; // Implement open script details

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#1A1440", "#0B0F17"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.greeting}>Hi, Sturdy Parent 👋</Text>
        <Text style={styles.heroTitle}>Let’s make today count.</Text>
        <Text style={styles.heroSub}>Gentle words. Stronger moments.</Text>
        <Pressable style={styles.primaryButton} onPress={handleCreateScript}>
          <Text style={styles.primaryButtonText}>+ Generate New Script</Text>
        </Pressable>
      </LinearGradient>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>This Week’s Progress</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: "25%" }]} />
        </View>
        <Text style={styles.cardValue}>1 of 5 free scripts used</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={styles.quickButton} onPress={handleCreateScript}>
          <Text style={styles.quickButtonText}>Generate Script</Text>
        </Pressable>
        <Pressable style={styles.quickButton} onPress={handleViewScripts}>
          <Text style={styles.quickButtonText}>My Scripts</Text>
        </Pressable>
      </View>

      {/* Latest Scripts */}
      <Text style={styles.sectionTitle}>Your Latest Scripts</Text>
      <FlatList
        data={scripts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 10, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <Pressable style={styles.scriptCard} onPress={() => handleScriptPress(item)}>
            <Text style={styles.scriptTitle}>{item.title}</Text>
            <Text style={styles.scriptSnippet} numberOfLines={2}>{item.snippet}</Text>
          </Pressable>
        )}
      />

      {/* Upsell Card */}
      <View style={styles.upsellCard}>
        <Text style={styles.upsellText}>
          🎉 Did you know? Premium users unlock audio playback and unlimited script saves!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  hero: {
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 16,
  },
  greeting: {
    color: "#B9A7FF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
    lineHeight: 38,
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: theme.textSize.md,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: theme.spacing.sm,
  },
  primaryButtonText: {
    color: "#1A1440",
    fontSize: theme.textSize.md,
    fontWeight: "900",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: "center",
  },
  cardLabel: {
    color: theme.colors.muted,
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 8,
  },
  cardValue: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: "800",
    marginTop: 6,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#ececec",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.accent,
    borderRadius: 5,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.lg,
    marginBottom: 12,
    gap: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 2,
  },
  quickButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: theme.spacing.lg,
    marginBottom: 8,
    marginTop: 8,
  },
  scriptCard: {
    backgroundColor: theme.colors.surface2,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    minWidth: 150,
    maxWidth: 180,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scriptTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  scriptSnippet: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  upsellCard: {
    backgroundColor: "#F3FBFF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    margin: 22,
    marginBottom: 34,
    borderWidth: 1,
    borderColor: "#CBDCF3",
  },
  upsellText: {
    color: "#204C5F",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});