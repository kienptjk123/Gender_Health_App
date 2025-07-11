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
    const inAuthFlow = ["auth", "onboarding", "tracking", "payment"].includes(
      currentRoute as string
    );

    // Specifically check for OTP verification pages - NEVER redirect from these
    const isOTPVerificationPage =
      fullRoute.includes("otp-verification") ||
      fullRoute.includes("verify-mobile-otp") ||
      fullRoute.includes("reset-password") || // Also protect reset password page
      segments.some(
        (segment) =>
          segment === "otp-verification" ||
          segment === "verify-mobile-otp" ||
          segment === "reset-password"
      );

    // Check if we're on any auth page or auth-related page
    const isAuthPage = currentRoute === "auth";

    // Check if we're on the Welcome screen
    const isWelcomeRoute = !currentRoute;

    console.log("AuthGuard - Current route:", currentRoute);
    console.log("AuthGuard - Full route:", fullRoute);
    console.log("AuthGuard - Is authenticated:", isAuthenticated);
    console.log("AuthGuard - In auth group:", inAuthGroup);
    console.log("AuthGuard - In auth flow:", inAuthFlow);
    console.log("AuthGuard - Is OTP verification page:", isOTPVerificationPage);
    console.log("AuthGuard - Is auth page:", isAuthPage);
    console.log("AuthGuard - Is welcome route:", isWelcomeRoute);

    // HIGHEST PRIORITY: NEVER redirect from OTP verification or reset password pages
    if (isOTPVerificationPage) {
      console.log(
        "AuthGuard - On OTP/Reset password page, ABSOLUTELY NO redirecting"
      );
      return;
    }

    // NEVER redirect from auth pages (login, register, forgot-password, etc.)
    if (isAuthPage) {
      console.log("AuthGuard - On auth page, letting user complete auth flow");
      return;
    }

    // NEVER redirect from auth flow pages
    if (inAuthFlow) {
      console.log("AuthGuard - In auth flow, allowing to continue");
      return;
    }

    // Only handle redirect logic for protected routes and welcome screen
    if (!isAuthenticated) {
      console.log("AuthGuard - User not authenticated");
      if (inAuthGroup) {
        console.log("AuthGuard - Redirecting to welcome from protected route");
        router.replace("/");
        return;
      }
      // Allow user to stay on public pages (welcome, auth, etc.)
      console.log("AuthGuard - User on public page, allowing access");
    } else {
      console.log("AuthGuard - User authenticated");
      if (isWelcomeRoute) {
        console.log("AuthGuard - Redirecting from welcome to tabs");
        try {
          router.replace("/(tabs)" as any);
        } catch (error) {
          console.error("AuthGuard - Error redirecting to tabs:", error);
        }
      }
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
