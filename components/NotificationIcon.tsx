import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotificationIconProps {
  unreadCount: number;
  size?: number;
  color?: string;
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  unreadCount,
  size = 24,
  color = "#374151",
  className = "w-11 h-11 rounded-full bg-white justify-center items-center shadow-sm relative",
}) => {
  const handlePress = () => {
    router.push("../notifications" as any);
  };

  return (
    <TouchableOpacity className={className} onPress={handlePress}>
      <Bell size={size} color={color} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 justify-center items-center">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationIcon;
