import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";

import { testPackageApi, orderApi, paymentApi } from "../apis";
import { useAuth } from "../contexts/AuthContext";
import { OrderFormData, OrderFormRequest } from "../models/testPackage";

export const TestBookingForm: React.FC = () => {
  console.log("🚀 [TestBookingForm] Component mounting...");

  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  console.log("📦 [TestBookingForm] Package ID from params:", packageId);
  console.log("👤 [TestBookingForm] User from AuthContext:", {
    user: user ? "logged in" : "not found",
    customer_profile_id: user?.customer_profile_id,
    email: user?.email,
    location: user?.location,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [price, setPrice] = useState(0);
  const [packageName, setPackageName] = useState("");

  console.log("🎛️ [TestBookingForm] Initial state:", {
    loading,
    submitting,
    showDatePicker,
    price,
    packageName,
    customerProfileId: user?.customer_profile_id,
  });

  const { control, handleSubmit, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      address: user?.location || "",
      phone: "",
      note: "",
      test_date: undefined,
    },
  });

  const testDate = watch("test_date");

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 [TestBookingForm] Starting fetchData...");
      console.log("📦 [TestBookingForm] Package ID:", packageId);

      try {
        console.log("🔄 [TestBookingForm] Fetching package details...");
        const packageRes = await testPackageApi.getTestPackageDetail(
          Number(packageId)
        );

        console.log("✅ [TestBookingForm] Package API response:", {
          status: packageRes ? "success" : "failed",
          data: packageRes?.data,
        });

        const pkg = packageRes.data;
        console.log("📦 [TestBookingForm] Package details:", {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
        });

        setPrice(pkg.price);
        setPackageName(pkg.name);

        // Auto-populate address from user context if available
        if (user?.location) {
          console.log(
            "� [TestBookingForm] Auto-populating address from user:",
            user.location
          );
          setValue("address", user.location);
        }

        console.log("✅ [TestBookingForm] Data fetch completed successfully");
      } catch (error: any) {
        console.error("❌ [TestBookingForm] Failed to load data:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack,
        });

        Toast.show({
          type: "error",
          text1: "Error loading data",
          text2: error?.response?.data?.message || error.message,
        });
      } finally {
        console.log(
          "🏁 [TestBookingForm] fetchData completed, setting loading to false"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId, setValue, user?.location]);

  const onSubmit = async (data: OrderFormData) => {
    console.log("🔄 [TestBookingForm] onSubmit started with data:", data);
    console.log("🔄 [TestBookingForm] Current state:", {
      customerProfileId: user?.customer_profile_id,
      price,
      packageName,
      packageId,
    });

    if (!user?.customer_profile_id) {
      console.error(
        "❌ [TestBookingForm] Missing customer profile ID from user context"
      );
      console.error("❌ [TestBookingForm] User object:", user);
      Toast.show({
        type: "error",
        text1: "Missing customer ID",
        text2: "Please login again",
      });
      return;
    }

    if (!data.test_date || dayjs(data.test_date).isBefore(dayjs(), "day")) {
      console.error("❌ [TestBookingForm] Invalid test date:", {
        test_date: data.test_date,
        formatted: data.test_date
          ? dayjs(data.test_date).format("YYYY-MM-DD")
          : null,
        today: dayjs().format("YYYY-MM-DD"),
      });
      Toast.show({
        type: "error",
        text1: "Invalid test date",
        text2: "Please choose a valid date in the future",
      });
      return;
    }

    const phonePattern = /^(03|05|07|08|09)\d{8}$/;
    if (!phonePattern.test(data.phone)) {
      console.error("❌ [TestBookingForm] Invalid phone number:", {
        phone: data.phone,
        pattern: phonePattern.toString(),
      });
      Toast.show({
        type: "error",
        text1: "Invalid phone number",
        text2: "Phone must be 10 digits and start with 03, 05, 07, 08, or 09",
      });
      return;
    }

    console.log(
      "✅ [TestBookingForm] Validation passed, starting submission..."
    );
    setSubmitting(true);

    try {
      const payload: OrderFormRequest = {
        ...data,
        phone: data.phone.trim(),
        note: data.note?.trim() || "",
        test_date: dayjs(data.test_date).format("YYYY-MM-DD"),
        test_package_id: Number(packageId),
        customer_profile_id: user.customer_profile_id,
      };

      console.log("📝 [TestBookingForm] Order payload:", payload);
      console.log("🔄 [TestBookingForm] Creating order...");

      const orderRes = await orderApi.createOrder(payload);
      console.log("✅ [TestBookingForm] Order API response:", {
        status: orderRes ? "success" : "failed",
        data: orderRes?.data,
      });

      const orderId = orderRes?.data?.id;
      if (!orderId) {
        console.error(
          "❌ [TestBookingForm] Order ID not found in response:",
          orderRes
        );
        throw new Error("❌ Order ID not found");
      }

      console.log("✅ [TestBookingForm] Order created with ID:", orderId);
      console.log("🔄 [TestBookingForm] Creating payment...");

      const paymentPayload = {
        order_id: orderId,
        amount: price,
      };
      console.log("💳 [TestBookingForm] Payment payload:", paymentPayload);

      const paymentRes = await paymentApi.createPayment(paymentPayload);
      console.log("✅ [TestBookingForm] Payment API response:", {
        status: paymentRes ? "success" : "failed",
        data: paymentRes?.data,
      });

      const url = paymentRes?.data?.payment_url;
      if (url) {
        console.log("✅ [TestBookingForm] Payment URL received:", url);

        // Check if payment URL has domain issues
        const urlDomain = url.match(/https?:\/\/([^\/]+)/)?.[1];
        if (urlDomain?.includes("developgenderhealth.io.vn")) {
          console.warn(
            "⚠️ [TestBookingForm] Detected problematic payment domain:",
            urlDomain
          );
          console.log("🎭 [TestBookingForm] Will use mock payment interface");
        }

        console.log("🔄 [TestBookingForm] Navigating to payment webview...");

        const navigationParams = {
          pathname: "/payment/webview" as any,
          params: { paymentUrl: encodeURIComponent(url) },
        };
        console.log(
          "🔄 [TestBookingForm] Navigation params:",
          navigationParams
        );

        router.push(navigationParams);
        console.log("✅ [TestBookingForm] Navigation completed");
      } else {
        console.error(
          "❌ [TestBookingForm] Payment URL not found in response:",
          paymentRes
        );
        throw new Error("❌ Payment URL not found");
      }
    } catch (err: any) {
      console.error("❌ [TestBookingForm] Booking failed:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
        fullError: err,
      });

      Toast.show({
        type: "error",
        text1: "Booking failed",
        text2: err?.response?.data?.message || err.message,
      });
    } finally {
      console.log(
        "🏁 [TestBookingForm] onSubmit completed, setting submitting to false"
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    console.log("⏳ [TestBookingForm] Rendering loading state");
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="mt-4 text-gray-600">Loading test package...</Text>
      </SafeAreaView>
    );
  }

  if (!packageName) {
    console.log(
      "❌ [TestBookingForm] Rendering error state - package not found"
    );
    console.log("🔍 [TestBookingForm] Current state when error:", {
      packageName,
      price,
      customerProfileId: user?.customer_profile_id,
      packageId,
    });
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-red-500 text-lg">Test package not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => {
            console.log("🔙 [TestBookingForm] Going back...");
            router.back();
          }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  console.log("✅ [TestBookingForm] Rendering main form");
  console.log("📋 [TestBookingForm] Final state before render:", {
    packageName,
    price,
    customerProfileId: user?.customer_profile_id,
    packageId,
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-2xl font-extrabold text-center text-pink-600 mb-2">
                Book Test Package
              </Text>
              <Text className="text-lg font-semibold text-center text-gray-800">
                {packageName}
              </Text>
              <Text className="text-2xl font-bold text-center text-pink-500 mt-2">
                ${price}
              </Text>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-1">
                Phone Number *
              </Text>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^(03|05|07|08|09)\d{8}$/,
                    message: "Invalid phone number format",
                  },
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextInput
                      className={`border px-4 py-3 text-base rounded-xl ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      keyboardType="phone-pad"
                      placeholder="Enter your phone number"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                    {error && (
                      <Text className="text-sm text-red-500 mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Address */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-1">
                Address *
              </Text>
              <Controller
                control={control}
                name="address"
                rules={{ required: "Address is required" }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextInput
                      className={`border px-4 py-3 text-base rounded-xl ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your address"
                      multiline
                      numberOfLines={2}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                    {error && (
                      <Text className="text-sm text-red-500 mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Test Date */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-1">
                Test Date *
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text className="text-base text-gray-600">
                  {testDate
                    ? dayjs(testDate).format("DD/MM/YYYY")
                    : "Select test date"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#888" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={testDate || new Date()}
                  minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setValue("test_date", date);
                    }
                  }}
                />
              )}
            </View>

            {/* Note */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-700 mb-1">
                Additional Notes
              </Text>
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    multiline
                    numberOfLines={4}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    placeholder="Add any additional notes..."
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 ${
                submitting ? "bg-pink-300" : "bg-pink-500"
              }`}
              onPress={() => {
                console.log("🖱️ [TestBookingForm] Submit button pressed");
                console.log("📝 [TestBookingForm] Form state at submit:", {
                  submitting,
                  customerProfileId: user?.customer_profile_id,
                  packageName,
                  price,
                });
                handleSubmit(onSubmit)();
              }}
              disabled={submitting}
            >
              {submitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Booking...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  Book Now
                </Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => router.back()}
            >
              <Text className="text-pink-500 font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
