import { apiService } from "@/apis/api";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "@/components/SafeArea";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending OTP for email:", email.trim());

      const response = await apiService.forgotPassword({ email: email.trim() });
      console.log("Forgot password response:", response);
      console.log("Response type:", typeof response);
      console.log("Response success:", response.success);
      console.log("Response message:", response.message);
      try {
        router.push({
          pathname: "/auth/otp-verification",
          params: {
            email: email.trim(),
            type: "forgot-password",
          },
        });
        console.log("Navigation completed successfully");
      } catch (navError) {
        console.error("Navigation error:", navError);
        // Fallback navigation method
        router.push(
          `/auth/otp-verification?email=${encodeURIComponent(
            email.trim()
          )}&type=forgot-password`
        );
      }

      // Show success message after navigation
      setTimeout(() => {
        Alert.alert(
          "OTP Sent! 📧",
          "We've sent a verification code to your email address. Please check your inbox and enter the code.",
          [{ text: "OK" }]
        );
      }, 100);
    } catch (error: any) {
      console.error("Forgot password error:", error);

      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.statusCode === 404) {
        errorMessage = "No account found with this email address.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea backgroundColor="#ffffff">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            Forgot Password? 🔑
          </Text>
          <Text className="text-gray-600 text-base leading-6">
            Don&apos;t worry, we&apos;ve got you covered. Enter your registered
            email address, and we&apos;ll send you an OTP code to reset your
            password.
          </Text>
        </View>

        <View className="mb-12">
          <Text className="text-gray-800 font-medium mb-2">
            Registered email address
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
            <Text className="text-gray-400 mr-3">📧</Text>
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 mb-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Send OTP Code
            </Text>
          )}
        </TouchableOpacity>

        {/* Debug/Test button - remove in production */}
        <TouchableOpacity
          className="rounded-full py-4 bg-gray-500 mt-4"
          onPress={() => {
            if (email.trim()) {
              router.push({
                pathname: "/auth/otp-verification",
                params: {
                  email: email.trim(),
                  type: "forgot-password",
                },
              });
            } else {
              Alert.alert("Error", "Please enter an email first");
            }
          }}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Test Navigation (Debug)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}
