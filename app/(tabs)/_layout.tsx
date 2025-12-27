import { Tabs } from "expo-router";
import { theme } from "../../src/styles/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface2,
          borderTopColor: "rgba(255,255,255,0.10)",
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* Hidden routes (still navigable via router.push) */}
      <Tabs.Screen name="create" options={{ href: null }} />
      <Tabs.Screen name="create2" options={{ href: null }} />
    </Tabs>
  );
}
