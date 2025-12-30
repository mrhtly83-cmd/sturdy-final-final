import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import ProfilePanel from "../_components/ProfilePanel";
import { theme } from "../../src/styles/theme";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ProfilePanel 
        email={user?.email} 
        userName={user?.email?.split("@")[0]}
      />
      
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <Text style={styles.buttonText}>View Full Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    color: "#fff",
    fontSize: theme.textSize.md,
    fontWeight: "800",
  },
});
