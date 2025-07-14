import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/models/profile";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileTab() {
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  // Convert user to UserProfile format for the modal
  const userProfile: UserProfile = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    avatar: user?.avatar || "",
  };

  const colors = {
    primary: "#ec4899", // pink-500
    primaryLight: "#fce7f3", // pink-100
    secondary: "#f3f4f6", // gray-100
    text: "#111827", // gray-900
    textLight: "#6b7280", // gray-500
    white: "#ffffff",
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (
    updatedProfile: UserProfile,
    changedFields: Partial<UserProfile>
  ) => {
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just show a success message
      console.log("Updated profile:", updatedProfile);
      console.log("Changed fields:", changedFields);

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully",
      });

      setShowEditModal(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Please try again later",
      });
    }
  };

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

  const profileSections = [
    {
      title: "Personal Information",
      items: [{ label: "Edit Profile", icon: "✏️", action: handleEditProfile }],
    },
    {
      title: "Health & Consultations",
      items: [
        {
          label: "Appointment History",
          icon: "📋",
          action: () => router.push("/appoinmentHistory" as any),
        },
        {
          label: "STI Tracking",
          icon: "🧪",
          action: () => router.push("/stiTracking" as any),
        },
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
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            ) : (
              <Text className="text-4xl">👤</Text>
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {user?.name || "User Name"}
          </Text>
          <Text className="text-gray-600 mb-4">{user?.email}</Text>
          <TouchableOpacity
            className="bg-pink-500 px-6 py-2 rounded-full"
            onPress={handleEditProfile}
          >
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditModal}
        userProfile={userProfile}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        colors={colors}
      />

      <Toast />
    </ScrollView>
  );
}
