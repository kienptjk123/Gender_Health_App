import { authService } from "@/apis/auth";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password Too Short",
        text2: "Password must be at least 6 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await authService.resetPassword({
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful! 🎉",
          text2: "Your password has been reset successfully",
        });

        setTimeout(() => {
          router.replace("/auth/login" as any);
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Reset Failed",
          text2:
            response.message || "Failed to reset password. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      let errorMessage = "Failed to reset password. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.statusCode === 400) {
        errorMessage =
          "Invalid request. Please try the forgot password process again.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Toast.show({
        type: "error",
        text1: "Reset Failed",
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
            Reset Password 🔒
          </Text>
          <Text className="text-gray-600 text-base leading-6">
            Create a new password for your account. Make sure it&apos;s strong
            and secure.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-800 font-medium mb-2">New Password</Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
            <Text className="text-gray-400 mr-3">🔒</Text>
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
            >
              <Text className="text-gray-400 text-xl">
                {showPassword ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-800 font-medium mb-2">
            Confirm New Password
          </Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
            <Text className="text-gray-400 mr-3">🔒</Text>
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
            >
              <Text className="text-gray-400 text-xl">
                {showConfirmPassword ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-600 text-sm leading-5">
            Password requirements:
          </Text>
          <Text className="text-gray-600 text-sm">
            • At least 6 characters long
          </Text>
          <Text className="text-gray-600 text-sm">
            • Must match the confirmation password
          </Text>
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Reset Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}
