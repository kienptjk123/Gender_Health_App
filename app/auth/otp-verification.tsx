import { SafeArea } from "@/components/SafeArea";
import { useAuth } from "@/contexts/AuthContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

interface OTPFormData {
  otp: string;
}

let globalOTPNavigationBlock = false;

export default function OTPVerification() {
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { verifyForgotPassword } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const type = params.type as string;

  const preventNavigation = useRef(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const { handleSubmit, watch, setValue } = useForm<OTPFormData>({
    defaultValues: {
      otp: "",
    },
  });

  const watchedOTP = watch("otp");

  useEffect(() => {
    globalOTPNavigationBlock = true;
    return () => {
      globalOTPNavigationBlock = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      preventNavigation.current = false;
      globalOTPNavigationBlock = true;

      return () => {
        if (!preventNavigation.current) {
          globalOTPNavigationBlock = false;
        }
      };
    }, [])
  );

  useEffect(() => {
    if (!email) {
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

  const onSubmit = async (data: OTPFormData) => {
    if (data.otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a 6-digit OTP",
      });
      return;
    }
    setLoading(true);
    try {
      preventNavigation.current = true;
      await verifyForgotPassword({
        email,
        otp: data.otp,
      });
      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: "Redirecting to reset password...",
      });

      setTimeout(() => {
        preventNavigation.current = false;
        globalOTPNavigationBlock = false;
        router.push({
          pathname: "/auth/reset-password",
          params: { email, otp: data.otp },
        });
      }, 1500);
    } catch (error: any) {
      preventNavigation.current = true;
      globalOTPNavigationBlock = true;

      setValue("otp", "");
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: error?.message || "Invalid OTP. Please try again.",
        position: "top",
        visibilityTime: 4000,
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
        text2: "Email is required to resend OTP",
      });
      return;
    }
    setCanResend(false);
    setResendTimer(60);
    try {
      Toast.show({
        type: "success",
        text1: "OTP Resent",
        text2: "Please check your email for the new OTP",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: "Please try again later",
      });
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const cleanText = text.replace(/\D/g, "");
    if (cleanText.length > 1) return;

    const currentOTP = watchedOTP.split("");
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
      const currentOTP = watchedOTP.split("");
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
                  Verify OTP
                </Text>
                <Text className="text-lg text-black text-center">
                  Enter the 6-digit code sent to
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
                        watchedOTP[index]
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-300"
                      }`}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={watchedOTP[index] || ""}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      autoFocus={index === 0}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                {watchedOTP.length > 0 && watchedOTP.length < 6 && (
                  <Text className="text-gray-500 text-sm text-center">
                    {6 - watchedOTP.length} digits remaining
                  </Text>
                )}
              </View>

              <View className="items-start mb-3">
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text className="text-pink-500 font-semibold underline">
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-gray-500">
                    Resend Code in {resendTimer}s
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className={`py-4 px-6 bg-[#f9a8d4] rounded-2xl ${
                  loading || watchedOTP.length !== 6 ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading || watchedOTP.length !== 6}
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
                    Didn&apos;t receive the code?{" "}
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
