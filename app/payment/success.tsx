import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Success Icon */}
      <View className="bg-green-100 p-8 rounded-full mb-6">
        <Ionicons name="checkmark-circle" size={80} color="#10b981" />
      </View>

      {/* Success Message */}
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
        Payment Successful!
      </Text>

      <Text className="text-gray-600 text-center mb-8 leading-relaxed">
        Your booking has been confirmed successfully. You will receive a
        confirmation email shortly.
      </Text>

      {/* Action Buttons */}
      <View className="w-full space-y-4">
        <TouchableOpacity
          className="bg-pink-500 py-4 rounded-lg"
          onPress={() => router.replace("/(tabs)/" as any)}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Go to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-pink-500 py-4 rounded-lg"
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text className="text-pink-500 text-center font-semibold text-lg">
            View My Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Additional Info */}
      <View className="mt-8 bg-gray-50 p-4 rounded-lg w-full">
        <Text className="text-gray-700 font-medium mb-2">
          What&apos;s Next?
        </Text>
        <Text className="text-gray-600 text-sm leading-relaxed">
          • You will receive a confirmation email with booking details{"\n"}•
          Our team will contact you to confirm the appointment time{"\n"}•
          Please arrive 15 minutes before your scheduled time
        </Text>
      </View>
    </View>
  );
}
