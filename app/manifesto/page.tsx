import React from "react";
import { View, StyleSheet } from "react-native";
import ManifestoContent from "../_components/ManifestoContent";
import { theme } from "../../src/styles/theme";

export default function ManifestoPage() {
  return (
    <View style={styles.container}>
      <ManifestoContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
