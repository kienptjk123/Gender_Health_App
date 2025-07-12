import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date | undefined;
  agreeTerms: boolean;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const { control, handleSubmit, watch, setValue } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
      agreeTerms: false,
    },
  });

  const watchedPassword = watch("password");
  const watchedDateOfBirth = watch("dateOfBirth");

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.agreeTerms) {
      Toast.show({
        type: "error",
        text1: "Terms Required",
        text2: "Please agree to terms and conditions",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    if (!data.dateOfBirth) {
      Toast.show({
        type: "error",
        text1: "Date Required",
        text2: "Please select your date of birth",
      });
      return;
    }

    const age = dayjs().diff(dayjs(data.dateOfBirth), "year");
    if (age < 13) {
      Toast.show({
        type: "error",
        text1: "Age Requirement",
        text2: "You must be at least 13 years old to register",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Starting registration process for:", data.email);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        date_of_birth: dayjs(data.dateOfBirth).format("YYYY-MM-DD"),
      });

      console.log("✅ Registration successful for:", data.email);

      Toast.show({
        type: "success",
        text1: "Registration Successful! 🎉",
        text2: "Please check your email for OTP verification",
        position: "top",
        visibilityTime: 3000,
      });

      // Navigate to mobile OTP verification page
      setTimeout(() => {
        try {
          router.push({
            pathname: "/auth/verify-mobile-otp",
            params: {
              email: data.email,
              type: "registration",
            },
          });
          console.log("✅ Navigation to mobile OTP verification completed");
        } catch (navigationError) {
          console.error(
            "⚠️ Navigation method 1 failed, trying alternative:",
            navigationError
          );
          router.push(
            `/auth/verify-mobile-otp?email=${encodeURIComponent(
              data.email
            )}&type=registration`
          );
        }
      }, 1000);
    } catch (error: any) {
      console.error("❌ Registration failed:", error);
      console.error("📊 Error type:", typeof error);
      console.error("🔍 Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Registration failed. Please try again.";
      let errorTitle = "Registration Failed";

      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("📝 Using API error message:", errorMessage);
      } else if (error?.message) {
        errorMessage = error.message;
        console.log("📝 Using error message:", errorMessage);
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
        errorTitle = "Network Error";
      } else if (error?.message?.includes("email")) {
        errorMessage = "Email already exists. Please use a different email.";
        errorTitle = "Email Already Exists";
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
      <LinearGradient
        colors={["#FFCBD7", "#F8BBD9"]}
        className="flex-1"
      >
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/1.png")}
            className="w-full h-full opacity-20"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="pt-16 pb-6 px-6">
            <Text className="text-4xl font-bold text-white text-center mb-2">
              Join Our Community
            </Text>
            <Text className="text-lg text-white/90 text-center">
              Create your account to get started
            </Text>
          </View>

          {/* Form Card */}
          <View className="flex-1 px-6 pb-8">
            <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              {/* Form Fields */}
              <View className="space-y-4">
                {/* Name Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <View className="relative">
                          <View className="absolute left-3 top-3 z-10">
                            <Ionicons name="person-outline" size={18} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Enter your full name"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            autoCapitalize="words"
                          />
                        </View>
                        {error && (
                          <Text className="text-red-500 text-xs mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* Email Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
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
                            <Ionicons name="mail-outline" size={18} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 ${
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
                          <Text className="text-red-500 text-xs mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* Date of Birth */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="border-2 border-pink-200 rounded-xl px-3 py-3 flex-row items-center justify-between bg-gray-50"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={18} color="#F8BBD9" />
                      <Text
                        className={`text-sm ml-2 ${
                          watchedDateOfBirth ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {watchedDateOfBirth
                          ? dayjs(watchedDateOfBirth).format("DD/MM/YYYY")
                          : "Select date of birth"}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down-outline" size={16} color="#F8BBD9" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      mode="date"
                      value={watchedDateOfBirth || new Date(2000, 0, 1)}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                          setValue("dateOfBirth", date);
                        }
                      }}
                    />
                  )}
                </View>

                {/* Password Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Password *
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
                            <Ionicons name="lock-closed-outline" size={18} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-12 py-3 text-sm bg-gray-50 ${
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
                          <Text className="text-red-500 text-xs mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* Confirm Password Field */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
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
                            <Ionicons name="shield-checkmark-outline" size={18} color="#F8BBD9" />
                          </View>
                          <TextInput
                            className={`border-2 rounded-xl pl-10 pr-12 py-3 text-sm bg-gray-50 ${
                              error ? "border-red-300" : "border-pink-200"
                            }`}
                            placeholder="Confirm your password"
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
                          <Text className="text-red-500 text-xs mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* Terms Agreement */}
                <View className="mt-4">
                  <Controller
                    control={control}
                    name="agreeTerms"
                    rules={{
                      required: "You must agree to the terms and conditions",
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => onChange(!value)}
                          className="flex-row items-start space-x-3 bg-pink-50 p-3 rounded-xl"
                        >
                          <View
                            className={`w-5 h-5 border-2 rounded mt-0.5 ${
                              value
                                ? "bg-pink-500 border-pink-500"
                                : "border-pink-300"
                            } items-center justify-center`}
                          >
                            {value && (
                              <Ionicons name="checkmark" size={12} color="white" />
                            )}
                          </View>
                          <Text className="text-xs text-gray-700 flex-1 leading-4">
                            I agree to the{" "}
                            <Text className="text-pink-600 font-semibold underline">
                              Terms and Conditions
                            </Text>{" "}
                            and{" "}
                            <Text className="text-pink-600 font-semibold underline">
                              Privacy Policy
                            </Text>
                          </Text>
                        </TouchableOpacity>
                        {error && (
                          <Text className="text-red-500 text-xs mt-1 ml-2">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <LinearGradient
                colors={loading ? ["#F8BBD9", "#FFCBD7"] : ["#F8BBD9", "#F06292"]}
                className="mt-6 rounded-xl"
              >
                <TouchableOpacity
                  className="py-3 px-6"
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  {loading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-bold text-base ml-2">
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-bold text-base text-center">
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              {/* Social Options */}
              <View className="mt-4">
                <View className="flex-row items-center mb-4">
                  <View className="flex-1 h-px bg-gray-300"></View>
                  <Text className="mx-3 text-gray-500 text-xs font-medium">OR</Text>
                  <View className="flex-1 h-px bg-gray-300"></View>
                </View>

                <TouchableOpacity className="bg-gray-100 rounded-xl py-3 px-4 border border-gray-200">
                  <View className="flex-row items-center justify-center">
                    <Text className="text-base mr-2">🌸</Text>
                    <Text className="text-gray-700 font-semibold text-sm">
                      Continue with Google
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="pb-8 px-6">
            <View className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Text className="text-white text-center text-sm">
                Already have an account?{" "}
                <Text
                  className="text-white font-bold underline"
                  onPress={() => router.push("/auth/login")}
                >
                  Sign In Here
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <Toast />
    </SafeArea>
  );
}
