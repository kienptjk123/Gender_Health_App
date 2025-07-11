import { SafeArea } from "@/components/SafeArea";
import { useAuth } from "@/contexts/AuthContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

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

  const { control, handleSubmit, watch, setValue } = useForm<OTPFormData>({
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

  const formatOTP = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 6);
    return cleaned;
  };

  return (
    <SafeArea>
      <View className="flex-1 justify-center px-8 bg-white">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Verify OTP
          </Text>
          <Text className="text-gray-600 text-center">
            Enter the 6-digit code sent to
          </Text>
          <Text className="text-pink-500 font-medium text-center mt-1">
            {email}
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-6">
          {/* OTP Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 text-center">
              Enter OTP Code
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
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInput
                    className={`border rounded-lg px-4 py-4 text-2xl text-center font-mono tracking-widest ${
                      error ? "border-red-500" : "border-gray-300 hi"
                    }`}
                    placeholder="000000"
                    onChangeText={(text) => {
                      const formatted = formatOTP(text);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus={true}
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

          {/* OTP Progress */}
          <View className="flex-row justify-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                className={`w-12 h-12 rounded-lg border-2 items-center justify-center ${
                  watchedOTP[index]
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={`text-xl font-bold ${
                    watchedOTP[index] ? "text-pink-500" : "text-gray-400"
                  }`}
                >
                  {watchedOTP[index] || "•"}
                </Text>
              </View>
            ))}
          </View>

          {/* Resend OTP */}
          <View className="items-center">
            {canResend ? (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text className="text-pink-500 font-medium">Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500">
                Resend OTP in {resendTimer}s
              </Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-8 rounded-lg py-4 ${
            loading || watchedOTP.length !== 6 ? "bg-gray-300" : "bg-pink-500"
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading || watchedOTP.length !== 6}
        >
          <Text
            className={`font-semibold text-lg text-center ${
              loading || watchedOTP.length !== 6
                ? "text-gray-500"
                : "text-white"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-gray-600">
            Didn&apos;t receive the code?{" "}
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
