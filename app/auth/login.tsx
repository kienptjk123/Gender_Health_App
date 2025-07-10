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
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields",
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

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password Too Short",
        text2: "Password must be at least 6 characters long",
      });
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password: password,
      });

      Toast.show({
        type: "success",
        text1: "Login Successful! 🎉",
        text2: "Welcome back!",
      });

      console.log("Login successful - redirecting to tabs");

      setTimeout(() => {
        try {
          router.replace("/(tabs)" as any);
        } catch (navError) {
          console.error("Navigation error:", navError);
          router.replace("/(tabs)/" as any);
        }
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.statusCode === 401) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.statusCode === 404) {
        errorMessage =
          "Account not found. Please check your email or register.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea
      backgroundColor="#ffffff"
      statusBarStyle="dark-content"
      edges={["top", "bottom", "left", "right"]}
    >
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            Welcome Back! 👋
          </Text>
          <Text className="text-gray-600 text-base">
            Sign in to your account to continue
          </Text>
        </View>

        <View className="space-y-6 mb-8">
          <View>
            <Text className="text-gray-800 font-medium mb-2">Email</Text>
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
                autoComplete="email"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-800 font-medium mb-2">Password</Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
              <Text className="text-gray-400 mr-3">🔒</Text>
              <TextInput
                className="flex-1 text-gray-800"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-3"
              >
                <Text className="text-gray-400">👁️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-row justify-end mb-8">
          <TouchableOpacity
            onPress={() => router.push("/auth/forgot-password" as any)}
          >
            <Text className="text-pink-500 font-medium">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Sign in
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}
