import { authService } from "@/apis/auth";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-20"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          className="flex-1 relative top-[120px]"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-16 pb-2 px-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 pb-8">
            <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <Text className="text-2xl font-bold text-black text-center mb-2">
                Forgot Password
              </Text>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
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
                      <View className="relative">
                        <View className="absolute left-3 top-3 z-10">
                          <Ionicons
                            name="mail-outline"
                            size={18}
                            color="#F8BBD9"
                          />
                        </View>
                        <TextInput
                          className={`border-2 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 ${
                            error ? "border-red-300" : "border-pink-200"
                          }`}
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
                        <Text className="text-red-500 text-sm mt-1 ml-2">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              <TouchableOpacity
                className="py-4 px-6 bg-[#f9a8d4] rounded-2xl"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-bold text-base ml-2">
                      Sending...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-base text-center">
                    Send OTP Code
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <Toast />
    </SafeArea>
  );
}
