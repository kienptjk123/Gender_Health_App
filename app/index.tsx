import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeArea } from "@/components/SafeArea";

export default function WelcomeScreen() {
  return (
    <SafeArea 
      backgroundColor="#ec4899" 
      statusBarStyle="light-content"
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View className="flex-1 justify-center items-center px-8">
        {/* App logo/icon */}
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-8 shadow-lg">
          <Text className="text-4xl">🌸</Text>
        </View>

        {/* App title */}
        <Text className="text-4xl font-bold text-white text-center mb-4">
          Women Health App
        </Text>

        <Text className="text-xl text-white/90 text-center mb-2">
          Authentication System
        </Text>

        <Text className="text-base text-white/80 text-center mb-12 leading-6">
          Secure login and registration for your health app
        </Text>

        {/* Action buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            className="bg-white rounded-full py-4"
            onPress={() => router.push("/auth/login")}
          >
            <Text className="text-pink-500 text-center text-lg font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-pink-400 rounded-full py-4 border-2 border-white"
            onPress={() => router.push("/auth/register")}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}
