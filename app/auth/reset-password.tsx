import { authService } from "@/apis/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const email = params.email as string;
  const otp = params.otp as string;

  const { control, handleSubmit, watch } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");
  useEffect(() => {
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "OTP is required. Please go back and try again.",
      });

      setTimeout(() => {
        router.replace("/auth/login");
      }, 3000);
    }
  }, [otp]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "OTP is required. Please go back and try again.",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        otp,
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: "You can now login with your new password",
      });

      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2:
          error?.message ||
          error?.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center px-8 bg-white">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Reset Password
          </Text>
          <Text className="text-gray-600 text-center">
            Create a new password for your account
          </Text>
          {email && (
            <Text className="text-pink-500 font-medium text-center mt-1">
              {email}
            </Text>
          )}
        </View>

        <View className="space-y-6">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              New Password
            </Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="relative">
                    <TextInput
                      className={`border rounded-lg px-4 py-3 pr-12 text-base ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter new password"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchedPassword || "Passwords do not match",
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <View className="relative">
                    <TextInput
                      className={`border rounded-lg px-4 py-3 pr-12 text-base ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Confirm new password"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-3"
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Password Requirements */}
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </Text>
            <Text className="text-sm text-gray-600">
              • At least 6 characters long{"\n"}• Contains both letters and
              numbers{"\n"}• Avoid common passwords
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-8 rounded-lg py-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Resetting Password...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Reset Password
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">
            Remember your password?{" "}
            <Text
              className="text-pink-500 font-semibold"
              onPress={() => router.push("/auth/login")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </SafeArea>
  );
}
