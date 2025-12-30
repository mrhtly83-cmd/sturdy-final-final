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
      <Tabs.Screen name="scripts" options={{ title: "My Scripts" }} /> {/* <--- Add this line! */}
    </Tabs>
  );
}