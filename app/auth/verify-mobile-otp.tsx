import { useLocalSearchParams, router } from "expo-router";
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
import { authService } from "@/apis/auth";

interface VerifyOTPFormData {
  otp: string;
}

export default function VerifyMobileOTP() {
  const { email, type } = useLocalSearchParams<{
    email: string;
    type?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { control, handleSubmit, setValue, watch } = useForm<VerifyOTPFormData>(
    {
      defaultValues: {
        otp: "",
      },
    }
  );

  const watchedOtp = watch("otp");

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    let interval: any;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(60);
  };

  const onSubmit = async (data: VerifyOTPFormData) => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Email is missing. Please go back and try again.",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Verifying mobile OTP for:", email);
      console.log("📝 OTP:", data.otp);
      console.log("🔍 Type:", type);

      await authService.verifyMobileOTP({
        otp: data.otp,
        email,
      });

      console.log("✅ Mobile OTP verification successful");

      Toast.show({
        type: "success",
        text1: "Verification Successful! 🎉",
        text2:
          type === "registration"
            ? "Your account has been verified successfully"
            : "OTP verification completed",
        position: "top",
        visibilityTime: 3000,
      });

      // Navigate to login page after successful verification
      setTimeout(() => {
        console.log("🔄 Navigating to login page");
        router.replace("/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error("❌ Mobile OTP verification error:", error);
      console.error("📊 Error type:", typeof error);
      console.error("🔍 Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "OTP verification failed. Please try again.";
      let errorTitle = "Verification Failed";

      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("📝 Using API error message:", errorMessage);
      } else if (error?.message) {
        errorMessage = error.message;
        console.log("📝 Using error message:", errorMessage);
      } else if (error?.error) {
        errorMessage = error.error;
        console.log("📝 Using error field:", errorMessage);
      }

      // Special handling for common OTP errors
      if (errorMessage.toLowerCase().includes("invalid")) {
        errorTitle = "Invalid OTP";
      } else if (errorMessage.toLowerCase().includes("expired")) {
        errorTitle = "OTP Expired";
        errorMessage = "OTP has expired. Please request a new one.";
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
        position: "top",
        visibilityTime: 5000,
      });

      // Don't navigate away on error - let user try again
      console.log("🔄 Staying on verification page for retry");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Email is missing. Please go back and try again.",
      });
      return;
    }

    try {
      setResendLoading(true);
      console.log("🔄 Resending mobile OTP for:", email);

      await authService.resendMobileOTP({
        email,
      });

      console.log("✅ Mobile OTP resent successfully");

      Toast.show({
        type: "success",
        text1: "OTP Resent! 📧",
        text2: "A new OTP has been sent to your email address",
        position: "top",
        visibilityTime: 3000,
      });

      setValue("otp", "");
      startCountdown();
    } catch (error: any) {
      console.error("❌ Resend mobile OTP error:", error);
      console.error("📊 Error type:", typeof error);
      console.error("🔍 Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to resend OTP. Please try again.";
      let errorTitle = "Resend Failed";

      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("📝 Using API error message:", errorMessage);
      } else if (error?.message) {
        errorMessage = error.message;
        console.log("📝 Using error message:", errorMessage);
      } else if (error?.error) {
        errorMessage = error.error;
        console.log("📝 Using error field:", errorMessage);
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
        position: "top",
        visibilityTime: 4000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center px-8 bg-white">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Verify Your Account
          </Text>
          <Text className="text-gray-600 text-center">
            We&apos;ve sent a verification code to
          </Text>
          <Text className="text-pink-500 font-semibold text-center mt-1">
            {email}
          </Text>
        </View>

        {/* OTP Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2 text-center">
            Enter 6-digit verification code
          </Text>
          <Controller
            control={control}
            name="otp"
            rules={{
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "OTP must be 6 digits",
              },
              maxLength: {
                value: 6,
                message: "OTP must be 6 digits",
              },
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must be 6 digits",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  className={`border-2 rounded-lg px-4 py-4 text-center text-2xl font-bold tracking-widest ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000000"
                  placeholderTextColor="#9ca3af"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  maxLength={6}
                  autoFocus
                />
                {error && (
                  <Text className="text-red-500 text-sm mt-1 text-center">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          className={`mb-6 rounded-lg py-4 ${
            loading || !watchedOtp || watchedOtp.length !== 6
              ? "bg-pink-300"
              : "bg-pink-500"
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading || !watchedOtp || watchedOtp.length !== 6}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Verifying...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Verify Code
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View className="items-center">
          <Text className="text-gray-600 mb-2">
            Didn&apos;t receive the code?
          </Text>

          {countdown > 0 ? (
            <Text className="text-pink-500 font-semibold">
              Resend in {formatTime(countdown)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendLoading}
              className="mb-2"
            >
              {resendLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#ec4899" />
                  <Text className="text-pink-500 font-semibold ml-2">
                    Sending...
                  </Text>
                </View>
              ) : (
                <Text className="text-pink-500 font-semibold">Resend Code</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">
            Wrong email address?{" "}
            <Text
              className="text-pink-500 font-semibold"
              onPress={() => router.back()}
            >
              Go Back
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </SafeArea>
  );
}
