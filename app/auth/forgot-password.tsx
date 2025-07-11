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
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (!data.email.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Please enter your email address",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Sending OTP for email:", data.email.trim());

      const response = await authService.forgotPassword({
        email: data.email.trim(),
      });

      console.log("✅ Forgot password response:", response);
      console.log("📊 Response type:", typeof response);
      console.log("🎯 Response success:", response.success);
      console.log("💬 Response message:", response.message);

      Toast.show({
        type: "success",
        text1: "OTP Sent Successfully! 📧",
        text2: "We've sent a verification code to your email address",
        position: "top",
        visibilityTime: 4000,
      });

      // Navigate to OTP verification page
      setTimeout(() => {
        try {
          router.push({
            pathname: "/auth/otp-verification",
            params: {
              email: data.email.trim(),
              type: "forgot-password",
            },
          });
          console.log(
            "✅ Navigation to OTP verification completed successfully"
          );
        } catch (navigationError) {
          console.error(
            "⚠️ Navigation method 1 failed, trying alternative:",
            navigationError
          );
          router.push(
            `/auth/otp-verification?email=${encodeURIComponent(
              data.email.trim()
            )}&type=forgot-password`
          );
        }
      }, 1000);
    } catch (error: any) {
      console.error("❌ Forgot password error:", error);
      console.error("📊 Error type:", typeof error);
      console.error("🔍 Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to send OTP. Please try again.";
      let errorTitle = "Failed to Send OTP";

      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("📝 Using API error message:", errorMessage);
      } else if (error?.message) {
        errorMessage = error.message;
        console.log("📝 Using error message:", errorMessage);
      } else if (error?.statusCode === 404) {
        errorMessage = "No account found with this email address.";
        errorTitle = "Account Not Found";
      } else if (error?.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
        errorTitle = "Server Error";
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
        errorTitle = "Network Error";
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
        position: "top",
        visibilityTime: 5000,
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
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 ${
                    error ? "border border-red-500" : ""
                  }`}
                >
                  <Text className="text-gray-400 mr-3">📧</Text>
                  <TextInput
                    className="flex-1 text-gray-800"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 mb-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleSubmit(onSubmit)}
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
      <Toast />
    </SafeArea>
  );
}
