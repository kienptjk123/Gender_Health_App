import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeArea } from "@/components/SafeArea";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <LinearGradient colors={["#FFCBD7", "#F8BBD9"]} className="flex-1">
        <View className="absolute inset-0">
          <Image
            source={require("@/assets/images/7.png")}
            className="w-full h-full opacity-30"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-white/95 rounded-3xl px-8 py-8 shadow-2xl w-full max-w-md">
            <View className="bg-red-100 p-6 rounded-full mb-6 self-center">
              <Ionicons name="close-circle" size={60} color="#ef4444" />
            </View>

            <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
              Payment Failed
            </Text>

            <Text className="text-gray-600 text-center mb-6 leading-relaxed">
              We couldn&apos;t process your payment. Please check your payment
              method and try again.
            </Text>

            {/* Action Buttons */}
            <View className="space-y-3 mb-6">
              <TouchableOpacity
                className="border-2 border-pink-200 py-4 rounded-2xl bg-white/50"
                onPress={() => router.push("/")}
              >
                <Text className="text-gray-700 text-center font-semibold text-lg">
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-pink-50/80 p-4 rounded-2xl">
              <Text className="text-gray-700 font-medium mb-2 text-center">
                Need Help?
              </Text>
              <Text className="text-gray-600 text-sm leading-relaxed text-center">
                • Check if your card has sufficient balance{"\n"}• Verify your
                card details are correct{"\n"}• Try using a different payment
                method{"\n"}• Contact our support team if the issue persists
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeArea>
  );
}
