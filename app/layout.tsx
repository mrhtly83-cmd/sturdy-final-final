import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChildProvider } from "@/hooks/useChild";

/**
 * Root layout component that wraps the entire app with ChildProvider context
 */
export default function RootLayout() {
  return (
    <ChildProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8FAFC" }, // brand-slate
        }}
      />
    </ChildProvider>
  );
}
