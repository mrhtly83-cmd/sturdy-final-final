import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AuthPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Auth Panel Component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
