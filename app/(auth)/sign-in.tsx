import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { theme } from "../../src/styles/theme";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      Alert.alert("Check your email", "We sent you a magic sign-in link.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
const redirectTo = AuthSession.makeRedirectUri();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (data?.url) {
      await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      router.replace("/(tabs)");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sturdy</Text>
      <Text style={styles.subtitle}>Sign in to generate your weekly calm script.</Text>

      <TextInput
        placeholder="Email address"
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={signInWithEmail} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Sending link..." : "Continue with email"}
        </Text>
      </Pressable>

      <View style={styles.divider} />

      <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 18,
  },
  googleButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  googleText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
