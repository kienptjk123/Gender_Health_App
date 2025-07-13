import { authService } from "@/apis/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { SafeArea } from "@/components/SafeArea";
import { LinearGradient } from "expo-linear-gradient";

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

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const { handleSubmit, setValue, watch } = useForm<VerifyOTPFormData>({
    defaultValues: {
      otp: "",
    },
  });

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

  const handleOTPChange = (text: string, index: number) => {
    const cleanText = text.replace(/\D/g, "");
    if (cleanText.length > 1) return;

    const currentOTP = watchedOtp.split("");
    currentOTP[index] = cleanText;
    const newOTP = currentOTP.join("");
    setValue("otp", newOTP);

    // Auto-focus next input
    if (cleanText && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      const currentOTP = watchedOtp.split("");
      if (currentOTP[index]) {
        // Clear current field
        currentOTP[index] = "";
        setValue("otp", currentOTP.join(""));
      } else if (index > 0) {
        // Move to previous field and clear it
        currentOTP[index - 1] = "";
        setValue("otp", currentOTP.join(""));
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-20"
            resizeMode="cover"
          />
        </View>

        <ScrollView
          className="flex-1 relative top-[180px]"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pb-8">
            <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <View className="px-">
                <Text className="text-2xl font-bold text-black text-center mb-1">
                  Verify Your Account
                </Text>
                <Text className="text-lg text-black text-center">
                  We&apos;ve sent a verification code to
                </Text>
                <Text className="text-black font-bold text-center mt-1">
                  {email}
                </Text>
              </View>
              <View className="mt-3">
                <View className="flex-row justify-center mb-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (!otpRefs.current) otpRefs.current = [];
                        otpRefs.current[index] = ref;
                      }}
                      className={`w-14 h-14 border-2 rounded-xl text-center text-xl font-bold bg-gray-50 ${
                        watchedOtp[index]
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-300"
                      }`}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={watchedOtp[index] || ""}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      autoFocus={index === 0}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                {watchedOtp.length > 0 && watchedOtp.length < 6 && (
                  <Text className="text-gray-500 text-sm text-center">
                    {6 - watchedOtp.length} digits remaining
                  </Text>
                )}
              </View>

              <View className="items-start mb-3">
                {countdown > 0 ? (
                  <Text className="text-gray-500">
                    Resend Code in {formatTime(countdown)}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={resendLoading}
                  >
                    {resendLoading ? (
                      <View className="flex-row items-center">
                        <ActivityIndicator size="small" color="#F8BBD9" />
                        <Text className="text-pink-500 font-semibold underline ml-2">
                          Sending...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-pink-500 font-semibold underline">
                        Resend Code
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                className={`py-4 px-6 bg-[#f9a8d4] rounded-2xl ${
                  loading || watchedOtp.length !== 6 ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading || !watchedOtp || watchedOtp.length !== 6}
              >
                {loading ? (
                  <Text className="text-white font-bold text-base text-center">
                    Verifying...
                  </Text>
                ) : (
                  <Text className="text-white font-bold text-base text-center">
                    NEXT
                  </Text>
                )}
              </TouchableOpacity>

              <View className="px-6">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 pt-4 pb-2 border border-white/20"
                >
                  <Text className="text-black text-center text-sm font-medium">
                    Wrong email address?{" "}
                    <Text className="font-bold underline text-pink-500">
                      Go Back
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
