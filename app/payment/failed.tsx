import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Error Icon */}
      <View className="bg-red-100 p-8 rounded-full mb-6">
        <Ionicons name="close-circle" size={80} color="#ef4444" />
      </View>

      {/* Error Message */}
      <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
        Payment Failed
      </Text>

      <Text className="text-gray-600 text-center mb-8 leading-relaxed">
        We couldn&apos;t process your payment. Please check your payment method
        and try again.
      </Text>

      {/* Action Buttons */}
      <View className="w-full space-y-4">
        <TouchableOpacity
          className="bg-pink-500 py-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 py-4 rounded-lg"
          onPress={() => router.push("/")}
        >
          <Text className="text-gray-600 text-center font-semibold text-lg">
            Go to Home
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help Section */}
      <View className="mt-8 bg-gray-50 p-4 rounded-lg w-full">
        <Text className="text-gray-700 font-medium mb-2">Need Help?</Text>
        <Text className="text-gray-600 text-sm leading-relaxed">
          • Check if your card has sufficient balance{"\n"}• Verify your card
          details are correct{"\n"}• Try using a different payment method{"\n"}•
          Contact our support team if the issue persists
        </Text>
      </View>
    </View>
  );
}
