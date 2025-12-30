import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2025 Sturdy. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
  },
  text: {
    color: "#888888",
    fontSize: 14,
  },
});
