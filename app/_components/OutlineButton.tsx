import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { theme } from "../../src/styles/theme";

interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function OutlineButton({ title, onPress, disabled }: OutlineButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: "800",
  },
});
