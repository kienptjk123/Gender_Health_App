import { useAuth } from "@/contexts/AuthContext";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 px-4">
      {/* Header */}
      <View className="pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-800">
          Hello, {user?.name || "User"}! 👋
        </Text>
        <Text className="text-gray-600 mt-1">How are you feeling today?</Text>
      </View>

      {/* Quick Stats Cards */}
      <View className="space-y-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                Cycle Day
              </Text>
              <Text className="text-3xl font-bold text-pink-500 mt-1">12</Text>
              <Text className="text-gray-500 text-sm">
                Next period in 16 days
              </Text>
            </View>
            <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center">
              <Text className="text-2xl">🌸</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                Mood Today
              </Text>
              <Text className="text-gray-600 mt-1">Tap to log your mood</Text>
            </View>
            <TouchableOpacity className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center">
              <Text className="text-2xl">😊</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                Water Intake
              </Text>
              <Text className="text-gray-600 mt-1">6/8 glasses today</Text>
            </View>
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
              <Text className="text-2xl">💧</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mt-8 mb-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <TouchableOpacity className="bg-pink-500 rounded-xl p-4 flex-1 min-w-[45%]">
            <Text className="text-white font-semibold text-center">
              Log Period
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 rounded-xl p-4 flex-1 min-w-[45%]">
            <Text className="text-white font-semibold text-center">
              Symptoms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-500 rounded-xl p-4 flex-1 min-w-[45%]">
            <Text className="text-white font-semibold text-center">
              Medications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-orange-500 rounded-xl p-4 flex-1 min-w-[45%]">
            <Text className="text-white font-semibold text-center">
              Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
