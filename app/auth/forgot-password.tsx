import { authService } from "@/apis/auth";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Please enter your email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Sending OTP for email:", email.trim());

      const response = await authService.forgotPassword({
        email: email.trim(),
      });
      console.log("Forgot password response:", response);
      console.log("Response type:", typeof response);
      console.log("Response success:", response.success);
      console.log("Response message:", response.message);

      Toast.show({
        type: "success",
        text1: "OTP Sent! 📧",
        text2: "We've sent a verification code to your email address",
      });

      // Navigate to OTP verification page first
      setTimeout(() => {
        try {
          router.push({
            pathname: "/auth/otp-verification",
            params: {
              email: email.trim(),
              type: "forgot-password",
            },
          });
          console.log("Navigation to OTP verification completed successfully");
        } catch {
          router.push(
            `/auth/otp-verification?email=${encodeURIComponent(
              email.trim()
            )}&type=forgot-password`
          );
        }
      }, 1000);
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

      Toast.show({
        type: "error",
        text1: "Failed to Send OTP",
        text2: errorMessage,
      });
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
      </View>
    </SafeArea>
  );
}
