import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { getUserScripts } from "../../src/services/databaseService";
import { theme } from "../../src/styles/theme";

export default function MyScriptsScreen() {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const result = await getUserScripts(user.id);
        setScripts(result || []);
      }
    })();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Scripts</Text>
      <FlatList
        data={scripts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.scriptCard}>
            <Text style={styles.scriptTitle}>{item.struggle}</Text>
            <Text style={styles.scriptSnippet} numberOfLines={2}>{item.content}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ padding: 22 }}>
            <Text style={{ color: theme.colors.muted }}>No saved scripts yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: 18 },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: "700", marginVertical: 14 },
  scriptCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 13,
    padding: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scriptTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  scriptSnippet: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});