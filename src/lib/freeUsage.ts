// src/lib/freeUsage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";

const KEY_COUNT = "free_scripts_used";
const KEY_MONTH = "free_scripts_reset_month";
const KEY_FIRST_UPSELL = "shown_first_script_upsell";
const FREE_LIMIT = 5;

function monthMarker() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Returns { allowed } and routes to paywall when limit reached.
export async function checkFreeLimitOrPaywall(): Promise<{ allowed: boolean }> {
  try {
    const currentMonth = monthMarker();

    const storedMonth = await AsyncStorage.getItem(KEY_MONTH);
    let count = Number((await AsyncStorage.getItem(KEY_COUNT)) ?? "0");

    // Reset count if new month
    if (storedMonth !== currentMonth) {
      count = 0;
      await AsyncStorage.setItem(KEY_MONTH, currentMonth);
      await AsyncStorage.setItem(KEY_COUNT, "0");
    }

    if (count >= FREE_LIMIT) {
      // navigate to paywall
      router.push(("/paywall" as unknown) as any);
      return { allowed: false };
    }

    return { allowed: true };
  } catch (e) {
    console.warn("Free usage check failed, allowing script:", e);
    return { allowed: true };
  }
}

export async function incrementFreeCount(): Promise<number> {
  try {
    const currentMonth = monthMarker();
    const storedMonth = await AsyncStorage.getItem(KEY_MONTH);
    let count = Number((await AsyncStorage.getItem(KEY_COUNT)) ?? "0");

    if (storedMonth !== currentMonth) {
      count = 0;
      await AsyncStorage.setItem(KEY_MONTH, currentMonth);
    }

    count = count + 1;
    await AsyncStorage.setItem(KEY_COUNT, String(count));
    return count;
  } catch (e) {
    console.warn("incrementFreeCount failed", e);
    return 0;
  }
}

export async function maybeShowFirstSuccessUpsell(): Promise<void> {
  try {
    const shown = await AsyncStorage.getItem(KEY_FIRST_UPSELL);
    if (shown === "1") return;

    Alert.alert(
      "Want to save scripts and reuse them anytime?",
      undefined,
      [
        {
          text: "Not now",
          style: "cancel",
          onPress: async () => {
            await AsyncStorage.setItem(KEY_FIRST_UPSELL, "1");
          },
        },
        { text: "See options", onPress: () => router.push(("/paywall" as unknown) as any) },
      ]
    );

    await AsyncStorage.setItem(KEY_FIRST_UPSELL, "1");
  } catch (e) {
    console.warn("maybeShowFirstSuccessUpsell failed", e);
  }
}

export async function showLockedFeatureUpsell(): Promise<void> {
  Alert.alert(
    "This is a premium feature",
    undefined,
    [
      { text: "Not now", style: "cancel" },
      { text: "See options", onPress: () => router.push(("/paywall" as unknown) as any) },
    ]
  );
}
