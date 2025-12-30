import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { theme } from "../../src/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { getUserScripts, getUserProfile } from "../../src/services/databaseService";
import { useAuth } from "../../src/contexts/AuthContext";
import { checkFreeLimitOrPaywall } from "../../src/lib/freeUsage";

const FREE_LIMIT = 5;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  // Fetch scripts + profile on mount
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setLoading(true);
      const [scriptsResult, profileResult] = await Promise.all([
        getUserScripts(user.id),
        getUserProfile(user.id),
      ]);
      setScripts(scriptsResult || []);
      setProfile(profileResult);

      // Check if limit reached to decide on upsell
      const limitCheck = await checkFreeLimitOrPaywall();
      setShowUpsell(!limitCheck.allowed);
      setLoading(false);
    }
    loadUserData();
  }, [user]);

  // Button handlers
  const handleCreateScript = () => router.push("/(tabs)/create");
  const handleViewScripts = () => router.push("/(tabs)/scripts");
  const handleScriptPress = (item: any) => {
    // You can route to a script detail screen: /script/[id]
    router.push({ pathname: "/(tabs)/scripts", params: { open: item.id } });
  };
  const handleUpgrade = () => router.push("/paywall");

  // Compute progress
  const used = profile?.scripts_used_this_week ?? 0;
  const progress = Math.min(used / FREE_LIMIT, 1);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#1A1440", "#0B0F17"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.greeting}>
          {profile?.email ? `Hi, ${profile.email.split("@")[0]} 👋` : "Hi, Sturdy Parent 👋"}
        </Text>
        <Text style={styles.heroTitle}>Let’s make today count.</Text>
        <Text style={styles.heroSub}>Gentle words. Stronger moments.</Text>
        <Pressable style={styles.primaryButton} onPress={handleCreateScript}>
          <Text style={styles.primaryButtonText}>+ Generate New Script</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>This Week’s Progress</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.cardValue}>{used} of {FREE_LIMIT} free scripts used</Text>
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

      <Text style={styles.sectionTitle}>Your Latest Scripts</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={scripts.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingLeft: 10, paddingBottom: 8 }}
          renderItem={({ item }) => (
            <Pressable style={styles.scriptCard} onPress={() => handleScriptPress(item)}>
              <Text style={styles.scriptTitle}>{item.struggle}</Text>
              <Text style={styles.scriptSnippet} numberOfLines={2}>{item.content}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text style={{ color: theme.colors.muted }}>No scripts yet!</Text>
            </View>
          }
        />
      )}

      {/* Upsell card if limit reached */}
      {showUpsell && (
        <View style={styles.upsellCard}>
          <Text style={styles.upsellText}>
            🚀 You’ve hit your free script limit! Unlock unlimited scripts, saving, and playback with Sturdy Complete.
          </Text>
          <Pressable style={styles.upsellButton} onPress={handleUpgrade}>
            <Text style={styles.upsellButtonText}>Upgrade Now</Text>
          </Pressable>
        </View>
      )}
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
    marginBottom: 14,
  },
  upsellButton: {
    marginTop: 8,
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 22,
  },
  upsellButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});