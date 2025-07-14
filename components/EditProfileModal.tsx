import { EditProfileModalProps, UserProfile } from "@/models/profile";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  userProfile,
  onClose,
  onSave,
  colors,
}) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);

  const handleSave = () => {
    if (!editedProfile.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    if (!editedProfile.email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedProfile.email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    const changedFields: Partial<UserProfile> = {};
    Object.keys(editedProfile).forEach((key) => {
      const typedKey = key as keyof UserProfile;
      if (editedProfile[typedKey] !== userProfile[typedKey]) {
        changedFields[typedKey] = editedProfile[typedKey];
      }
    });

    onSave(editedProfile, changedFields);
  };

  const handleImagePicker = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => openCamera() },
      { text: "Gallery", onPress: () => openImageLibrary() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedProfile({ ...editedProfile, avatar: result.assets[0].uri });
    }
  };

  const openImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to select photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedProfile({ ...editedProfile, avatar: result.assets[0].uri });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-[#f8f8f8]">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-500 text-base font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-gray-800">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-pink-500 text-base font-semibold">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View className="items-center mb-6">
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={{ uri: editedProfile.avatar }}
                className="w-28 h-28 rounded-full border-4 border-white"
              />
              <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-pink-500 border-4 border-white items-center justify-center">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="mt-3 text-sm text-gray-500">
              Tap to change photo
            </Text>
          </View>

          {/* Form */}
          <View
            className="bg-white rounded-xl mx-5 p-5 mb-6 shadow-lg"
            style={{ shadowColor: "#F9A8D4" }}
          >
            {[
              { label: "Full Name", key: "name", keyboard: "default" },
              { label: "Email", key: "email", keyboard: "email-address" },
              { label: "Phone Number", key: "phone", keyboard: "phone-pad" },
              { label: "Location", key: "location", keyboard: "default" },
            ].map(({ label, key, keyboard }) => (
              <View key={key} className="mb-5">
                <Text className="text-gray-700 font-semibold mb-1">
                  {label}
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-base"
                  value={editedProfile[key as keyof UserProfile] as string}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, [key]: text })
                  }
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  keyboardType={keyboard as any}
                  autoCapitalize="none"
                />
              </View>
            ))}

            {/* Bio */}
            <View className="mb-3">
              <Text className="text-gray-700 font-semibold mb-1">Bio</Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-base h-24 text-top"
                value={editedProfile.bio}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, bio: text })
                }
                placeholder="Enter your bio"
                multiline
              />
            </View>
          </View>

          {/* Extra Options */}
          <View className="bg-white rounded-xl mx-5 mb-10 shadow-sm">
            {[
              {
                label: "Privacy Settings",
                icon: "shield-checkmark-outline",
              },
              {
                label: "Connected Accounts",
                icon: "link-outline",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100"
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.textLight}
                  />
                  <Text className="ml-4 text-gray-800 text-base">
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfileModal;
