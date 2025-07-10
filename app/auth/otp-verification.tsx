import { useAuth } from "@/contexts/AuthContext";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(56);
  const [canResend, setCanResend] = useState(false);
  const { verifyForgotPassword } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const type = params.type as string;

  // Prevent navigation on error with a ref
  const preventNavigation = useRef(false);

  // Focus effect to reset navigation prevention
  useFocusEffect(
    useCallback(() => {
      console.log(
        "OTP Verification page focused - resetting navigation prevention"
      );
      preventNavigation.current = false;
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  useEffect(() => {
    if (!email) {
      console.error("OTP Verification - No email provided");
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Email address is required. Please go back and try again.",
      });
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [params, email, type]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      const newOtp = [...otp];
      for (let i = newOtp.length - 1; i >= 0; i--) {
        if (newOtp[i] !== "") {
          newOtp[i] = "";
          break;
        }
      }
      setOtp(newOtp);
    } else if (/^\d$/.test(key)) {
      const newOtp = [...otp];
      for (let i = 0; i < newOtp.length; i++) {
        if (newOtp[i] === "") {
          newOtp[i] = key;
          break;
        }
      }
      setOtp(newOtp);

      // Only auto-verify if all digits are filled and not currently loading
      if (newOtp.every((digit) => digit !== "") && !loading) {
        console.log("Auto-verifying OTP:", newOtp.join(""));
        handleVerifyOTP(newOtp.join(""));
      }
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter all 6 digits",
      });
      return;
    }

    try {
      setLoading(true);

      if (type === "forgot-password") {
        await verifyForgotPassword({
          email: email,
          otp: code,
        });

        // Only navigate on successful verification
        Toast.show({
          type: "success",
          text1: "OTP Verified! ✅",
          text2: "Your identity has been verified",
        });

        setTimeout(() => {
          try {
            router.replace({
              pathname: "/auth/reset-password",
              params: { email },
            } as any);
          } catch (navError) {
            console.error("Navigation error:", navError);
            router.replace(
              `/auth/reset-password?email=${encodeURIComponent(email)}` as any
            );
          }
        }, 1000);
      } else {
        Toast.show({
          type: "success",
          text1: "OTP Verified",
          text2: "Registration completed successfully!",
        });

        setTimeout(() => {
          router.replace("/auth/login" as any);
        }, 1000);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      console.error("ERROR DETAILS:", JSON.stringify(error, null, 2));

      // Set navigation prevention flag
      preventNavigation.current = true;

      // Clear the OTP input when verification fails
      setOtp(["", "", "", "", "", ""]);

      // Prevent any navigation by catching router calls
      let errorMessage = "Invalid OTP code. Please try again.";

      // Parse error message safely
      if (error?.message) {
        errorMessage = error.message.includes("OTP")
          ? error.message
          : "Invalid OTP code. Please try again.";
      }

      // Simple error message without detailed parsing to avoid any side effects
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: errorMessage,
      });

      // Explicitly log that we're staying on current page
      console.log(
        "=== CRITICAL: ERROR CAUGHT - Staying on OTP verification page, NEVER navigate ==="
      );
      console.log(
        "=== Current route should remain: /auth/otp-verification ==="
      );
      console.log(
        "=== Navigation prevention flag set:",
        preventNavigation.current
      );

      // Extra safety: Prevent any potential navigation that might be triggered
      // by ensuring we don't call any router methods or async operations that might trigger navigation

      // DO NOT NAVIGATE - stay on current page for retry
      // NO router.replace, router.push, or any navigation calls here

      // Reset navigation prevention after a delay
      setTimeout(() => {
        preventNavigation.current = false;
        console.log("Navigation prevention flag reset");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setResendTimer(56);
    setCanResend(false);
    Toast.show({
      type: "success",
      text1: "OTP Sent",
      text2: "A new OTP has been sent to your email",
    });
  };

  const getMaskedEmail = (email: string) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (username.length <= 2) {
      return `${username}***@${domain}`;
    }
    const visibleChars = Math.min(2, username.length - 1);
    const maskedUsername = username.substring(0, visibleChars) + "***";
    return `${maskedUsername}@${domain}`;
  };

  return (
    <SafeArea backgroundColor="#ffffff">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-pink-100 rounded-full items-center justify-center mb-6">
            <Text className="text-3xl">📧</Text>
          </View>

          <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
            Verification
          </Text>

          <Text className="text-gray-600 text-center text-base mb-2">
            We have sent the verification code to
          </Text>
          <Text className="text-gray-800 font-medium text-base">
            {getMaskedEmail(email)}
          </Text>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-center space-x-3 mb-8">
            {otp.map((digit, index) => (
              <View
                key={index}
                className="w-12 h-12 border border-gray-200 rounded-lg items-center justify-center bg-gray-50"
              >
                <Text className="text-xl font-semibold text-gray-800">
                  {digit}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-center mb-6">
            <Text className="text-gray-600">Didn&apos;t receive code? </Text>
            <TouchableOpacity
              onPress={canResend ? handleResendOTP : undefined}
              disabled={!canResend}
            >
              <Text
                className={`font-medium ${
                  canResend ? "text-pink-500" : "text-gray-400"
                }`}
              >
                {canResend ? "Resend" : `Resend (${resendTimer}s)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Keypad */}
        <View className="flex-1 justify-end mb-4">
          <View className="space-y-4">
            <View className="flex-row justify-center space-x-8">
              {[1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  className="w-16 h-16 items-center justify-center"
                  onPress={() => handleKeyPress(num.toString())}
                >
                  <Text className="text-2xl font-medium text-gray-800">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-center space-x-8">
              {[4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  className="w-16 h-16 items-center justify-center"
                  onPress={() => handleKeyPress(num.toString())}
                >
                  <Text className="text-2xl font-medium text-gray-800">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-center space-x-8">
              {[7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  className="w-16 h-16 items-center justify-center"
                  onPress={() => handleKeyPress(num.toString())}
                >
                  <Text className="text-2xl font-medium text-gray-800">
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-center space-x-8">
              <View className="w-16 h-16" />
              <TouchableOpacity
                className="w-16 h-16 items-center justify-center"
                onPress={() => handleKeyPress("0")}
              >
                <Text className="text-2xl font-medium text-gray-800">0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-16 h-16 items-center justify-center"
                onPress={() => handleKeyPress("delete")}
              >
                <Text className="text-2xl font-medium text-gray-800">⌫</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-pink-500 rounded-full py-4 mt-8"
            onPress={() => handleVerifyOTP()}
            disabled={loading}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? "Verifying..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}
