import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ManifestoContent() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Our Manifesto</Text>
      <Text style={styles.text}>
        We believe in the power of gentle words and strong connections.
        Sturdy helps parents create meaningful moments with their children.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
});
