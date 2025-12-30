import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Mobile layout component
 */
export default function MobileLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0B0F17" },
        }}
      />
    </>
  );
}
