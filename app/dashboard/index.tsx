import { useAuth } from "@/contexts/AuthContext";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeArea } from "@/components/SafeArea";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeArea backgroundColor="#ffffff">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Welcome back!
            </Text>
            <Text className="text-gray-600">{user?.name || user?.email}</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Content */}
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-pink-100 rounded-full items-center justify-center mb-6">
            <Text className="text-3xl">✅</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
            Authentication Successful!
          </Text>

          <Text className="text-gray-600 text-center text-base mb-8">
            You have successfully logged in to the Women Health App
          </Text>

          {/* User Info */}
          <View className="w-full bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              User Information
            </Text>
            <Text className="text-gray-600">Email: {user?.email}</Text>
            <Text className="text-gray-600">Name: {user?.name}</Text>
            <Text className="text-gray-600">User ID: {user?.id}</Text>
          </View>

          <Text className="text-gray-500 text-center text-sm">
            This is a demo dashboard. In a real app, you would add your health
            tracking features here.
          </Text>
        </View>
      </View>
    </SafeArea>
  );
}
