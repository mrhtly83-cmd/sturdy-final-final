import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Header_Integrated() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sturdy</Text>
      <View style={styles.nav}>
        <Pressable onPress={() => router.push("/about")}>
          <Text style={styles.navLink}>About</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/manifesto")}>
          <Text style={styles.navLink}>Manifesto</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/profile")}>
          <Text style={styles.navLink}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  nav: {
    flexDirection: "row",
    gap: 16,
  },
  navLink: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
