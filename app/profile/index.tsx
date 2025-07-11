import { useAuth } from "@/contexts/AuthContext";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileTab() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            Toast.show({
              type: "success",
              text1: "Logged Out",
              text2: "You have been successfully logged out",
            });
          } catch (error: any) {
            console.error("Logout error:", error);
            Toast.show({
              type: "error",
              text1: "Logout Failed",
              text2: "Please try again",
            });
          }
        },
      },
    ]);
  };

  // Alternative simple logout (uncomment if you prefer no confirmation)
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     Toast.show({
  //       type: "success",
  //       text1: "Logged Out",
  //       text2: "You have been successfully logged out",
  //     });
  //   } catch (error: any) {
  //     console.error("Logout error:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Logout Failed",
  //       text2: "Please try again",
  //     });
  //   }
  // };

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        { label: "Edit Profile", icon: "✏️", action: () => {} },
        { label: "Health Profile", icon: "🏥", action: () => {} },
        { label: "Cycle Settings", icon: "🔄", action: () => {} },
      ],
    },
    {
      title: "App Settings",
      items: [
        { label: "Notifications", icon: "🔔", action: () => {} },
        { label: "Privacy", icon: "🔒", action: () => {} },
        { label: "Data Export", icon: "📤", action: () => {} },
        { label: "Backup & Sync", icon: "☁️", action: () => {} },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Help Center", icon: "❓", action: () => {} },
        { label: "Contact Support", icon: "💬", action: () => {} },
        { label: "Report a Bug", icon: "🐛", action: () => {} },
        { label: "Rate App", icon: "⭐", action: () => {} },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1">
      {/* Profile Header */}
      <View className="bg-white px-6 py-8">
        <View className="items-center">
          <View className="w-24 h-24 bg-pink-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">{user?.avatar || "👤"}</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {user?.name || "User Name"}
          </Text>
          <Text className="text-gray-600 mb-4">{user?.email}</Text>
          <TouchableOpacity className="bg-pink-500 px-6 py-2 rounded-full">
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-white rounded-xl p-4 mr-2 items-center">
            <Text className="text-2xl font-bold text-pink-500">12</Text>
            <Text className="text-gray-600 text-sm text-center">
              Cycles Tracked
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 mx-1 items-center">
            <Text className="text-2xl font-bold text-blue-500">28</Text>
            <Text className="text-gray-600 text-sm text-center">
              Avg Cycle Length
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 ml-2 items-center">
            <Text className="text-2xl font-bold text-green-500">45</Text>
            <Text className="text-gray-600 text-sm text-center">
              Days Active
            </Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3 px-2">
              {section.title}
            </Text>
            <View className="bg-white rounded-xl overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0"
                  onPress={item.action}
                >
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-3">{item.icon}</Text>
                    <Text className="text-gray-800 font-medium">
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-lg">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 rounded-xl p-4 flex-row items-center justify-center mb-6"
        >
          <Text className="text-red-500 font-semibold text-lg">Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View className="items-center py-4">
          <Text className="text-gray-500 text-sm">Women Health App</Text>
          <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
}
