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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { Ionicons } from "@expo/vector-icons";
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
    <SafeArea>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center">
              Join us for a healthier lifestyle
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Name Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
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
                    <TextInput
                      className={`border rounded-lg px-4 py-3 text-base ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCapitalize="words"
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

            {/* Email Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
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

            {/* Date of Birth */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between"
              >
                <Text
                  className={`text-base ${
                    watchedDateOfBirth ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {watchedDateOfBirth
                    ? dayjs(watchedDateOfBirth).format("DD/MM/YYYY")
                    : "Select your date of birth"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
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
              <Text className="text-sm font-medium text-gray-700 mb-2">
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
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
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

            {/* Confirm Password Field */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
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
                      <TextInput
                        className={`border rounded-lg px-4 py-3 pr-12 text-base ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Confirm your password"
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

            {/* Terms Agreement */}
            <View>
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
                      className="flex-row items-center space-x-3"
                    >
                      <View
                        className={`w-6 h-6 border-2 rounded ${
                          value
                            ? "bg-pink-500 border-pink-500"
                            : "border-gray-300"
                        } items-center justify-center`}
                      >
                        {value && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                      <Text className="text-sm text-gray-700 flex-1">
                        I agree to the{" "}
                        <Text className="text-pink-500 underline">
                          Terms and Conditions
                        </Text>{" "}
                        and{" "}
                        <Text className="text-pink-500 underline">
                          Privacy Policy
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    {error && (
                      <Text className="text-red-500 text-sm mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
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
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg text-center">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-600">
              Already have an account?{" "}
              <Text
                className="text-pink-500 font-semibold"
                onPress={() => router.push("/auth/login")}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeArea>
  );
}
