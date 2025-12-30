import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Footer_Integrated() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.linksContainer}>
        <Pressable onPress={() => router.push("/about")}>
          <Text style={styles.link}>About</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/privacy")}>
          <Text style={styles.link}>Privacy</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/terms")}>
          <Text style={styles.link}>Terms</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/contact")}>
          <Text style={styles.link}>Contact</Text>
        </Pressable>
      </View>
      <Text style={styles.copyright}>© 2025 Sturdy. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
  },
  linksContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  link: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  copyright: {
    color: "#888888",
    fontSize: 12,
  },
});
