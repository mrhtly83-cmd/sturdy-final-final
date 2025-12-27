import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { checkFreeLimitOrPaywall, incrementFreeCount, maybeShowFirstSuccessUpsell } from "../../src/lib/freeUsage";

export default function ChallengeStep() {
  async function onGenerate() {
    const res = await checkFreeLimitOrPaywall();
    if (!res.allowed) return; // routed to paywall

    // simulate generation
    await incrementFreeCount();
    Alert.alert("Script generated", "Here is your calm script (simulated)");

    // gentle upsell after first success
    await maybeShowFirstSuccessUpsell();
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 18 }}>Challenge Step</Text>
      <TouchableOpacity onPress={onGenerate} style={{ padding: 12, backgroundColor: '#4dd0a1', borderRadius: 10 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Generate script</Text>
      </TouchableOpacity>
    </View>
  );
}
