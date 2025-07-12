import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient
        colors={["#FFCBD7", "#F8BBD9"]}
        className="flex-1"
      >
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-30"
            resizeMode="cover"
          />
        </View>

        {/* Content Overlay */}
        <View className="flex-1 relative">
          {/* Header */}
          <View className="pt-16 pb-8 px-6">
            <Text className="text-4xl font-bold text-white text-center mb-2">
              Welcome Back
            </Text>
            <Text className="text-lg text-white/90 text-center">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Login Form Card */}
          <View className="flex-1 px-6">
            <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              {/* Form Fields */}
              <View className="space-y-6">
                {/* Email Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
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
                        <View className="relative">
                          <View className="absolute left-4 top-4 z-10">
                            <Ionicons name="mail-outline" size={20} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-2xl pl-12 pr-4 py-4 text-base bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
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

                {/* Password Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
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
                          <View className="absolute left-4 top-4 z-10">
                            <Ionicons name="lock-closed-outline" size={20} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-2xl pl-12 pr-14 py-4 text-base bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Enter your password"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4"
                          >
                            <Ionicons
                              name={showPassword ? "eye-off-outline" : "eye-outline"}
                              size={20}
                              color="#F8BBD9"
                            />
                          </TouchableOpacity>
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

                {/* Forgot Password Link */}
                <View className="items-end">
                  <TouchableOpacity
                    onPress={() => router.push("/auth/forgot-password")}
                  >
                    <Text className="text-pink-500 font-semibold text-base">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <LinearGradient
                colors={loading ? ["#F8BBD9", "#FFCBD7"] : ["#F8BBD9", "#F06292"]}
                className="mt-8 rounded-2xl"
              >
                <TouchableOpacity
                  className="py-4 px-6"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  {loading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-bold text-lg ml-3">
                        Signing In...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold text-lg text-center">
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-gray-300"></View>
                <Text className="mx-4 text-gray-500 font-medium">OR</Text>
                <View className="flex-1 h-px bg-gray-300"></View>
              </View>

              {/* Social Login */}
              <TouchableOpacity className="bg-gray-100 rounded-2xl py-4 px-6 border border-gray-200">
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg mr-2">🌸</Text>
                  <Text className="text-gray-700 font-semibold text-base">
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="pb-8 pt-4 px-6">
            <View className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Text className="text-white text-center text-base">
                Don&apos;t have an account?{" "}
                <Text
                  className="text-white font-bold underline"
                  onPress={() => router.push("/auth/register")}
                >
                  Sign Up Here
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <Toast />
    </SafeArea>
  );
}
