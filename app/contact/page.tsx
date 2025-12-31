import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { theme } from "../../src/styles/theme";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", "Your message has been sent!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.subtitle}>We’d love to hear from you!</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor={theme.colors.muted}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Message"
        placeholderTextColor={theme.colors.muted}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
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
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.textSize.md,
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: theme.textSize.md,
    fontWeight: "800",
  },
});
