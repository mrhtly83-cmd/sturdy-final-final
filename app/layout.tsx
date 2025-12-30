import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/contexts/AuthContext";
import { FormDataProvider } from "../src/contexts/FormDataContext";

/**
 * Root layout component for web platform
 * This provides a similar layout structure to _layout.tsx
 */
export default function RootLayoutWeb() {
  return (
    <AuthProvider>
      <FormDataProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </FormDataProvider>
    </AuthProvider>
  );
}
