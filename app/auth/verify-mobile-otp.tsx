import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { authService } from "@/apis/auth";

export default function VerifyMobileOTP() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a valid 6-digit OTP",
      });
      return;
    }

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

      await authService.verifyMobileOTP({
        otp,
        email,
      });

      Toast.show({
        type: "success",
        text1: "Verification Successful! 🎉",
        text2: "Your account has been verified successfully",
      });

      setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "OTP verification failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }

      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: errorMessage,
      });
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

      await authService.resendMobileOTP({
        email,
      });

      Toast.show({
        type: "success",
        text1: "OTP Resent! 📧",
        text2: "A new OTP has been sent to your email address",
      });

      setOtp("");
      startCountdown();
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      let errorMessage = "Failed to resend OTP. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }

      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: errorMessage,
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
    <SafeArea backgroundColor="#ffffff">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            Verify Your Account 📧
          </Text>
          <Text className="text-gray-600 text-base">
            We&apos;ve sent a 6-digit code to{" "}
            <Text className="font-semibold text-gray-800">{email}</Text>
          </Text>
          <Text className="text-gray-600 text-base mt-2">
            Please enter the code to verify your account.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-gray-800 font-medium mb-2">Enter OTP Code</Text>
          <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
            <Text className="text-gray-400 mr-3">🔢</Text>
            <TextInput
              className="flex-1 text-gray-800 text-center text-2xl font-bold tracking-widest"
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              autoComplete="one-time-code"
            />
          </View>
        </View>

        <TouchableOpacity
          className={`rounded-full py-4 mb-6 ${
            loading ? "bg-pink-300" : "bg-pink-500"
          }`}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-600 text-sm mb-2">
            Didn&apos;t receive the code?
          </Text>

          {countdown > 0 ? (
            <Text className="text-gray-500 text-sm">
              Resend available in {formatTime(countdown)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendLoading}
              className="flex-row items-center"
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#EC4899" />
              ) : (
                <Text className="text-pink-500 text-sm font-semibold">
                  Resend OTP
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600 text-sm">Having trouble? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="text-pink-500 text-sm font-semibold">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}
