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
import {
  OrderFormData,
  OrderFormRequest,
  TestPackageItem,
} from "../models/testPackage";

export const TestBookingForm: React.FC = () => {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [testPackage, setTestPackage] = useState<TestPackageItem | null>(null);

  const { control, handleSubmit, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      address: "",
      phone: "",
      note: "",
      test_date: undefined,
    },
  });

  const testDate = watch("test_date");

  useEffect(() => {
    const fetchTestPackage = async () => {
      if (!packageId) {
        Toast.show({
          type: "error",
          text1: "Invalid package ID",
        });
        router.back();
        return;
      }

      try {
        const response = await testPackageApi.getTestPackageDetail(
          Number(packageId)
        );
        setTestPackage(response.data);
      } catch (error: any) {
        console.error("Failed to load test package:", error);
        Toast.show({
          type: "error",
          text1: "Error loading test package",
          text2: error?.response?.data?.message || "Please try again",
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTestPackage();
  }, [packageId, router]);

  const onSubmit = async (data: OrderFormData) => {
    if (!testPackage) {
      Toast.show({
        type: "error",
        text1: "Test package not found",
      });
      return;
    }

    if (!data.test_date || dayjs(data.test_date).isBefore(dayjs(), "day")) {
      Toast.show({
        type: "error",
        text1: "Invalid test date",
        text2: "Please choose a valid date in the future",
      });
      return;
    }

    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(data.phone)) {
      Toast.show({
        type: "error",
        text1: "Invalid phone number",
        text2: "Phone must start with 0 and have 10 digits",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: OrderFormRequest = {
        ...data,
        phone: data.phone.trim(),
        note: data.note?.trim() || "",
        test_date: dayjs(data.test_date).format("YYYY-MM-DD"),
        test_package_id: Number(packageId),
        customer_profile_id: 1,
      };

      const orderRes = await orderApi.createOrder(payload);
      const orderId = orderRes?.data?.id;

      if (!orderId) {
        throw new Error("Order ID not found");
      }

      const paymentRes = await paymentApi.createPayment({
        order_id: orderId,
        amount: testPackage.price,
      });

      const paymentUrl = paymentRes?.data?.payment_url;
      if (paymentUrl) {
        // Navigate to payment webview
        Toast.show({
          type: "success",
          text1: "Booking successful!",
          text2: "Redirecting to payment...",
        });

        // Navigate to payment webview
        router.push({
          pathname: "/payment/webview" as any,
          params: {
            paymentUrl: encodeURIComponent(paymentUrl),
            orderId: orderId.toString(),
            amount: testPackage.price.toString(),
          },
        });
      } else {
        throw new Error("Payment URL not found");
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      Toast.show({
        type: "error",
        text1: "Booking failed",
        text2: err?.response?.data?.message || err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="mt-4 text-gray-600">Loading test package...</Text>
      </SafeAreaView>
    );
  }

  if (!testPackage) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-red-500 text-lg">Test package not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
                {testPackage.name}
              </Text>
              <Text className="text-2xl font-bold text-center text-pink-500 mt-2">
                ${testPackage.price}
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
                    value: /^0\d{9}$/,
                    message: "Phone must start with 0 and have 10 digits",
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
                      placeholder="Enter your phone number (e.g., 0123456789)"
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
              onPress={handleSubmit(onSubmit)}
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
