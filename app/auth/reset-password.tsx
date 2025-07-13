import { authService } from "@/apis/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-20"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          className="flex-1 relative top-[110px]"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pb-8">
            <View className="bg-white/95 backdrop-blur-sm rounded-3xl px-6 py-6 pt-4 shadow-2xl">
              <View className="">
                <Text className="text-2xl font-bold text-black text-center mb-1">
                  Reset Password
                </Text>
                <Text className="text-base text-black text-center">
                  Create a new password for your account
                </Text>
              </View>

              <View className="space-y-4 mt-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
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
                          <View className="absolute left-3 top-3 z-10">
                            <Ionicons
                              name="lock-closed-outline"
                              size={18}
                              color="#F8BBD9"
                            />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-12 py-3 text-sm bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Enter new password"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3"
                          >
                            <Ionicons
                              name={
                                showPassword ? "eye-off-outline" : "eye-outline"
                              }
                              size={18}
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

                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
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
                          <View className="absolute left-3 top-3 z-10">
                            <Ionicons
                              name="shield-checkmark-outline"
                              size={18}
                              color="#F8BBD9"
                            />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-12 py-3 text-sm bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Confirm new password"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={!showConfirmPassword}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-3"
                          >
                            <Ionicons
                              name={
                                showConfirmPassword
                                  ? "eye-off-outline"
                                  : "eye-outline"
                              }
                              size={18}
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

                <View className="bg-pink-50 p-4 rounded-xl border border-pink-100 mt-5">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Password Requirements:
                  </Text>
                  <Text className="text-sm text-gray-600">
                    • At least 6 characters long{"\n"}• Contains both letters
                    and numbers{"\n"}• Avoid common passwords
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="py-4 px-6 bg-[#f9a8d4] rounded-2xl mt-5"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-bold text-base ml-2">
                      Resetting Password...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-base text-center">
                    Reset Password
                  </Text>
                )}
              </TouchableOpacity>
              <View className="px-6">
                <TouchableOpacity
                  onPress={() => router.push("/auth/login")}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 pt-4 border border-white/20"
                >
                  <Text className="text-black text-center text-sm font-medium">
                    Remember your password?{" "}
                    <Text className="font-bold underline text-pink-500">
                      Sign In
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <Toast />
    </SafeArea>
  );
}
