import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/contexts/AuthContext";
import { FormDataProvider } from "../src/contexts/FormDataContext";

export default function RootLayout() {
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
