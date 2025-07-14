import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

import AuthGuard from "@/components/AuthGuard";
import { SafeProvider } from "@/components/SafeArea";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeProvider>
        <AuthProvider>
          <ChatbotProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <AuthGuard>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="home" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="tracking"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="calendar"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="blog" options={{ headerShown: false }} />
                  <Stack.Screen name="forum" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="profile"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="test" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="payment"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </AuthGuard>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ChatbotProvider>
        </AuthProvider>
      </SafeProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
