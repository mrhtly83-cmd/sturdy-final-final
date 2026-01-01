import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useChildren } from "../../src/hooks/useChildren";
import { checkFreeLimitOrPaywall } from "../../src/lib/freeUsage";
import { SturdyResponse } from "../../src/lib/sturdyBrain";
import { getUserProfile, getUserScripts } from "../../src/services/databaseService";
import { theme } from "../../src/styles/theme";

const FREE_LIMIT = 5;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { children, loading: loadingChildren, error: childrenError } = useChildren();

  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  // SOS state
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [sosText, setSosText] = useState("");
  const [sosLoading, setSosLoading] = useState(false);
  const [sosError, setSosError] = useState<string | null>(null);
  const [sosResponse, setSosResponse] = useState<SturdyResponse | null>(null);

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
    router.push({ pathname: "/(tabs)/scripts", params: { open: item.id } });
  };
  const handleUpgrade = () => router.push("/paywall");

  // Compute progress
  const used = profile?.scripts_used_this_week ?? 0;
  const progress = Math.min(used / FREE_LIMIT, 1);

  const handleSOS = async () => {
    if (!sosText.trim()) {
      setSosError("Tell us what’s happening so we can help.");
      return;
    }
    setSosLoading(true);
    setSosError(null);
    setSosResponse(null);

    try {
      const res = await fetch("/api/sturdy/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          scenarioType: "SOS",
          description: sosText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setSosError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSosResponse(data as SturdyResponse);
    } catch (err) {
      setSosError("Network error. Please try again.");
    } finally {
      setSosLoading(false);
    }
  };

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

      {/* SOS Hero */}
      <View style={styles.sosCard}>
        <Text style={styles.sosLabel}>I NEED HELP NOW</Text>
        <Text style={styles.sosSubtitle}>Script me through a crisis</Text>

        {/* Child picker */}
        {loadingChildren ? (
          <ActivityIndicator />
        ) : childrenError ? (
          <Text style={styles.errorText}>{childrenError}</Text>
        ) : (
          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>Choose a child (optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
              {children.map((c) => {
                const active = selectedChildId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => setSelectedChildId(active ? null : c.id)}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {c.name}
                    </Text>
                  </Pressable>
                );
              })}
              {children.length === 0 && <Text style={styles.muted}>No children yet</Text>}
            </ScrollView>
          </View>
        )}

        {/* SOS text input */}
        <Text style={styles.inputLabel}>What is happening?</Text>
        <TextInput
          value={sosText}
          onChangeText={setSosText}
          placeholder="He threw the tablet when screen time ended..."
          placeholderTextColor="#6B7280"
          style={styles.textArea}
          multiline
        />

        {sosError && <Text style={styles.errorText}>{sosError}</Text>}

        <Pressable style={[styles.sosButton, sosLoading && styles.sosButtonDisabled]} onPress={handleSOS} disabled={sosLoading}>
          <Text style={styles.sosButtonText}>{sosLoading ? "Thinking…" : "Script me through a crisis"}</Text>
        </Pressable>

        {/* SOS response */}
        {sosResponse && (
          <View style={styles.responseCard}>
            <Text style={styles.responseLabel}>Validation</Text>
            <Text style={styles.responseBody}>{sosResponse.validation}</Text>
            <Text style={[styles.responseLabel, { marginTop: 12 }]}>Shift</Text>
            <Text style={[styles.responseBody, { fontStyle: "italic" }]}>{sosResponse.shift}</Text>
            <Text style={[styles.responseLabel, { marginTop: 12 }]}>Script</Text>
            <View style={styles.scriptBubble}>
              <Text style={styles.scriptText}>{sosResponse.script}</Text>
            </View>
          </View>
        )}
      </View>

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
  sosCard: {
    backgroundColor: theme.colors.surface2,
    borderRadius: 18,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sosLabel: {
    color: "#FACC15",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 4,
  },
  sosSubtitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  pickerBox: { marginBottom: 12 },
  pickerLabel: { color: theme.colors.muted, marginBottom: 6, fontWeight: "600" },
  pillRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  pillActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  pillText: { color: theme.colors.text, fontWeight: "700" },
  pillTextActive: { color: "#fff" },
  muted: { color: theme.colors.muted },
  inputLabel: {
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 12,
    color: theme.colors.text,
    minHeight: 110,
    backgroundColor: theme.colors.surface,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  sosButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  sosButtonDisabled: { opacity: 0.7 },
  sosButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "800",
  },
  responseCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  responseLabel: {
    color: theme.colors.muted,
    fontWeight: "700",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  responseBody: {
    color: theme.colors.text,
    fontSize: 15,
    marginTop: 4,
  },
  scriptBubble: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.surface2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scriptText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
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
  errorText: { color: "#FCA5A5", marginTop: 4 },
});