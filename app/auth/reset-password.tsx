import { apiService } from "@/apis/api";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleResetPassword = async () => {
    // Validate all required fields
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.resetPassword({
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });

      if (response.success) {
        Alert.alert(
          "Password Reset Successful! 🎉",
          "Your password has been reset successfully. You can now login with your new password.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/auth/login" as any)
            }
          ]
        );
      } else {
        Alert.alert("Error", response.message || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      let errorMessage = "Failed to reset password. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.statusCode === 400) {
        errorMessage = "Invalid request. Please try the forgot password process again.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Alert.alert("Reset Failed", errorMessage);
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
            Create a new password for your account. Make sure it&apos;s strong and
            secure.
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
