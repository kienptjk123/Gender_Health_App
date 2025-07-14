import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeArea } from "@/components/SafeArea";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        {/* Background Image */}
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-30"
            resizeMode="cover"
          />
        </View>

        {/* Content Overlay */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-white/95 rounded-3xl px-8 py-8 shadow-2xl w-full max-w-md">
            {/* Success Icon */}
            <View className="bg-green-100 p-6 rounded-full mb-6 self-center">
              <Ionicons name="checkmark-circle" size={60} color="#10b981" />
            </View>

            {/* Success Message */}
            <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
              Payment Successful!
            </Text>

            <Text className="text-gray-600 text-center mb-6 leading-relaxed">
              Your booking has been confirmed successfully. You will receive a
              confirmation email shortly.
            </Text>

            {/* Action Buttons */}
            <View className="space-y-3 mb-4">
              <TouchableOpacity
                className="bg-[#f9a8d4] py-4 rounded-2xl"
                onPress={() => router.replace("/(tabs)/" as any)}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Go to Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border-2 border-pink-200 py-4 rounded-2xl bg-white/50"
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Text className="text-gray-700 text-center font-semibold text-lg">
                  View My Bookings
                </Text>
              </TouchableOpacity>
            </View>

            {/* Celebration Message */}
            <View className="bg-green-50/80 p-4 rounded-2xl">
              <Text className="text-green-700 font-medium text-center">
                🎉 Thank you for choosing our service! 🎉
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeArea>
  );
}
