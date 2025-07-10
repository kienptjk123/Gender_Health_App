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
    const fullRoute = segments.join("/");
    const inAuthGroup = currentRoute === "(tabs)";
    const inAuthFlow = ["auth", "dashboard", "tracking", "onboarding"].includes(
      currentRoute as string
    );

    // Specifically check for OTP verification pages - NEVER redirect from these
    const isOTPVerificationPage =
      fullRoute.includes("otp-verification") ||
      fullRoute.includes("verify-mobile-otp") ||
      segments.some(
        (segment) =>
          segment === "otp-verification" || segment === "verify-mobile-otp"
      );

    // Check if we're on the Welcome screen
    const isWelcomeRoute = !currentRoute;

    console.log("AuthGuard - Current route:", currentRoute);
    console.log("AuthGuard - Full route:", fullRoute);
    console.log("AuthGuard - Is authenticated:", isAuthenticated);
    console.log("AuthGuard - In auth group:", inAuthGroup);
    console.log("AuthGuard - In auth flow:", inAuthFlow);
    console.log("AuthGuard - Is OTP verification page:", isOTPVerificationPage);
    console.log("AuthGuard - Is welcome route:", isWelcomeRoute);

    // CRITICAL: Never redirect from OTP verification pages
    if (isOTPVerificationPage) {
      console.log("AuthGuard - On OTP verification page, NEVER redirecting");
      return;
    }

    if (!isAuthenticated) {
      // User is not authenticated
      console.log("AuthGuard - User not authenticated");
      if (inAuthGroup) {
        // Trying to access protected route, redirect to welcome
        console.log("AuthGuard - Redirecting to welcome from protected route");
        router.replace("/");
        return;
      }
      // For auth flows (including other auth pages) - DO NOTHING
      // Let user stay on current screen to complete auth process
      if (inAuthFlow) {
        console.log("AuthGuard - User in auth flow, allowing to continue");
        return;
      }
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
