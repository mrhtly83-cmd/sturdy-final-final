import { router } from "expo-router";
import { Alert } from "react-native";

const FREE_LIMIT = 5;
const KEY_COUNT = "free_scripts_used";
const KEY_MONTH = "free_scripts_reset_month";
const KEY_FIRST_UPSELL = "shown_first_script_upsell";

// Lightweight storage wrapper: try native AsyncStorage, else fallback to in-memory.
type StorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let storage: StorageLike | null = null;

async function getStorage(): Promise<StorageLike> {
  if (storage) return storage;

  try {
    // try to require community AsyncStorage at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    storage = AsyncStorage;
  } catch (e) {
    const map = new Map<string, string>();
    storage = {
      getItem: async (k: string) => map.get(k) ?? null,
      setItem: async (k: string, v: string) => {
        map.set(k, v);
        return Promise.resolve();
      },
    };
  }

  return storage as StorageLike;
}

function monthMarker(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function checkFreeLimitOrPaywall(): Promise<{ allowed: boolean }> {
  const s = await getStorage();
  const currentMarker = monthMarker();
  const storedMarker = await s.getItem(KEY_MONTH);
  let count = Number((await s.getItem(KEY_COUNT)) ?? "0");

  if (storedMarker !== currentMarker) {
    count = 0;
    await s.setItem(KEY_COUNT, "0");
    await s.setItem(KEY_MONTH, currentMarker);
  }

  if (count >= FREE_LIMIT) {
    router.push(("/paywall" as unknown) as any);
    return { allowed: false };
  }

  // allowed for now
  return { allowed: true };
}

export async function incrementFreeCount(): Promise<number> {
  const s = await getStorage();
  const currentMarker = monthMarker();
  const storedMarker = await s.getItem(KEY_MONTH);
  let count = Number((await s.getItem(KEY_COUNT)) ?? "0");

  if (storedMarker !== currentMarker) {
    count = 0;
    await s.setItem(KEY_MONTH, currentMarker);
  }

  count = count + 1;
  await s.setItem(KEY_COUNT, String(count));
  return count;
}

export async function maybeShowFirstSuccessUpsell(): Promise<void> {
  const s = await getStorage();
  const shown = await s.getItem(KEY_FIRST_UPSELL);
  if (shown === "1") return;

  // gentle prompt
  Alert.alert(
    "Want to save scripts and reuse them anytime?",
    undefined,
    [
      { text: "Not now", style: "cancel", onPress: async () => { await s.setItem(KEY_FIRST_UPSELL, "1"); } },
      { text: "See options", onPress: () => router.push(("/paywall" as unknown) as any) },
    ],
  );

  await s.setItem(KEY_FIRST_UPSELL, "1");
}

export async function showLockedFeatureUpsell(): Promise<void> {
  Alert.alert(
    "This is a premium feature",
    undefined,
    [
      { text: "Not now", style: "cancel" },
      { text: "See options", onPress: () => router.push(("/paywall" as unknown) as any) },
    ],
  );
}
