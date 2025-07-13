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
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-30"
            resizeMode="cover"
          />
        </View>

        {/* Content Overlay */}
        <View className="flex-1 relative top-[150px]">
          {/* Header */}

          {/* Login Form Card */}
          <View className="flex-1 px-6 bg-opacity- backdrop-blur-0">
            <View className="bg-white/95 rounded-3xl px-8 pt-4 py-6 shadow-2xl">
              <View className="">
                <Text className="text-2xl font-bold text-black text-center">
                  Welcome Back
                </Text>
                <Text className="text-lg text-black text-center">
                  Sign in to continue your journey
                </Text>
              </View>
              <View className="space-y-3">
                <View className="py-2">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">
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
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <View className="relative">
                          <View className="absolute left-4 top-4 z-10">
                            <Ionicons
                              name="mail-outline"
                              size={20}
                              color="#F8BBD9"
                            />
                          </View>
                          <TextInput
                            className={`border-2 rounded-2xl pl-12 pr-4 py-4 text-sm bg-gray-50 ${
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
                          <Text className="text-red-500 text-sm mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                <View className="">
                  <Text className="text-sm font-semibold text-gray-700 mb-1">
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
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <View className="relative">
                          <View className="absolute left-4 top-4 z-10">
                            <Ionicons
                              name="lock-closed-outline"
                              size={20}
                              color="#F8BBD9"
                            />
                          </View>
                          <TextInput
                            className={`border-2 rounded-2xl pl-12 pr-14 py-4 text-sm bg-gray-50 ${
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
                              name={
                                showPassword ? "eye-off-outline" : "eye-outline"
                              }
                              size={20}
                              color="#F8BBD9"
                            />
                          </TouchableOpacity>
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

                <View className="items-end mt-3">
                  <TouchableOpacity
                    onPress={() => router.push("/auth/forgot-password")}
                  >
                    <Text className="text-pink-500 font-semibold text-sm">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="py-4 px-6 bg-[#f9a8d4] mt-3 rounded-2xl"
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
                  <Text className="text-white font-bold text-base text-center ">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View className="px-2">
                <View className="bg-white/20 backdrop-blur-sm rounded-2xl pt-4">
                  <Text className="text-black text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Text
                      className="text-pink-500 font-bold underline"
                      onPress={() => router.push("/auth/register")}
                    >
                      Sign Up Here
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <Toast />
    </SafeArea>
  );
}
