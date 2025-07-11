import { useAuth } from "@/contexts/AuthContext";
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
import { Ionicons } from "@expo/vector-icons";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });
      router.replace("/(tabs)/" as any);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error?.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center px-8 bg-white">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-center">
            Sign in to your account
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-6">
          {/* Email Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address
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
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    className={`border rounded-lg px-4 py-3 text-base ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
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
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <View className="relative">
                    <TextInput
                      className={`border rounded-lg px-4 py-3 pr-12 text-base ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <View className="items-end">
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
            >
              <Text className="text-pink-500 font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
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
                Signing In...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Text
              className="text-pink-500 font-semibold"
              onPress={() => router.push("/auth/register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </SafeArea>
  );
}
