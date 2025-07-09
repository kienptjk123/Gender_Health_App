import { useAuth } from "@/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeArea } from "@/components/SafeArea";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(56);
  const [canResend, setCanResend] = useState(false);
  const { verifyForgotPassword } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const type = params.type as string; // "forgot-password" or "register"

  // Debug logging
  useEffect(() => {
    console.log("OTP Verification - Received params:", params);
    console.log("OTP Verification - Email:", email);
    console.log("OTP Verification - Type:", type);

    // Check if email is missing and show error
    if (!email) {
      console.error("OTP Verification - No email provided");
      Alert.alert(
        "Error",
        "Email address is required. Please go back and try again.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ]
      );
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
      // Handle backspace
      const newOtp = [...otp];
      for (let i = newOtp.length - 1; i >= 0; i--) {
        if (newOtp[i] !== "") {
          newOtp[i] = "";
          break;
        }
      }
      setOtp(newOtp);
    } else if (/^\d$/.test(key)) {
      // Handle number input
      const newOtp = [...otp];
      for (let i = 0; i < newOtp.length; i++) {
        if (newOtp[i] === "") {
          newOtp[i] = key;
          break;
        }
      }
      setOtp(newOtp);

      // Auto verify when all digits are entered
      if (newOtp.every((digit) => digit !== "")) {
        handleVerifyOTP(newOtp.join(""));
      }
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      Alert.alert("Error", "Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);

      if (type === "forgot-password") {
        // Verify forgot password OTP
        await verifyForgotPassword({
          email: email,
          otp: code,
        });

        Alert.alert(
          "OTP Verified! ✅",
          "Your identity has been verified. You can now reset your password.",
          [
            {
              text: "Reset Password",
              onPress: () =>
                router.replace({
                  pathname: "/auth/reset-password",
                  params: { email },
                } as any),
            },
          ]
        );
      } else {
        // This is for register OTP verification (future implementation)
        Alert.alert("OTP Verified", "Registration completed successfully!");
        router.replace("/auth/login" as any);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "Invalid OTP code. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.statusCode === 400) {
        errorMessage = "Invalid or expired OTP code.";
      } else if (error.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setResendTimer(56);
    setCanResend(false);
    Alert.alert("OTP Sent", "A new OTP has been sent to your email");
  };

  // Function to mask email for privacy
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
            {" "}
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
