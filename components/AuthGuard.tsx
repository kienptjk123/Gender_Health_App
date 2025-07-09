import { useAuth } from "@/contexts/AuthContext";
import { router, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === "(tabs)";
    const inAuthFlow = ["auth", "dashboard", "tracking", "onboarding"].includes(
      currentRoute as string
    );

    // Check if we're on the Welcome screen
    const isWelcomeRoute = !currentRoute;

    console.log("AuthGuard - Current route:", currentRoute);
    console.log("AuthGuard - Is authenticated:", isAuthenticated);
    console.log("AuthGuard - In auth group:", inAuthGroup);
    console.log("AuthGuard - In auth flow:", inAuthFlow);
    console.log("AuthGuard - Is welcome route:", isWelcomeRoute);

    if (!isAuthenticated) {
      // User is not authenticated
      console.log("AuthGuard - User not authenticated");
      if (inAuthGroup) {
        // Trying to access protected route, redirect to welcome
        console.log("AuthGuard - Redirecting to welcome from protected route");
        router.replace("/");
      }
      // For auth flows and welcome screen - DO NOTHING
      // Let user stay on current screen even if validation fails
    } else {
      // User is authenticated
      console.log("AuthGuard - User authenticated");
      if (isWelcomeRoute) {
        // On welcome screen but authenticated - redirect to tabs
        console.log("AuthGuard - Redirecting from welcome to tabs");
        try {
          router.replace("/(tabs)" as any);
        } catch (error) {
          console.error("AuthGuard - Error redirecting to tabs:", error);
        }
      }
      // For auth flows when authenticated - let them finish their flow
      // Don't auto-redirect from auth screens
    }
  }, [isAuthenticated, isLoading, segments, user]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
