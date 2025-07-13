import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/models/notification";
import { router } from "expo-router";
import { ArrowLeft, Bell, CheckCheck, Eye } from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen = () => {
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const onRefresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      Alert.alert("Error", "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      Alert.alert("Success", "All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      Alert.alert("Error", "Failed to mark all notifications as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_SUCCESS":
        return "💳";
      case "REMINDER":
        return "⏰";
      case "SYSTEM":
        return "📱";
      default:
        return "📢";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      className={`p-4 border-b border-gray-100 ${
        item.status === "UNREAD" ? "bg-blue-50" : "bg-white"
      }`}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View className="flex-row items-start">
        <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center mr-3">
          <Text className="text-xl">{getNotificationIcon(item.type)}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className={`text-base font-semibold ${
                item.status === "UNREAD" ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {item.title}
            </Text>
            {item.status === "UNREAD" && (
              <View className="w-3 h-3 rounded-full bg-blue-500 ml-2" />
            )}
          </View>

          <Text
            className={`text-sm mb-2 ${
              item.status === "UNREAD" ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {item.message}
          </Text>

          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-gray-400">
              {formatDate(item.createdAt)}
            </Text>
            {item.status === "READ" && (
              <View className="flex-row items-center">
                <Eye size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 ml-1">Read</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EC4899" />
          <Text className="text-gray-500 mt-2">Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Bell size={20} color="#374151" />
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View className="ml-2 px-2 py-1 bg-red-500 rounded-full">
              <Text className="text-white text-xs font-bold">
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            className="flex-row items-center"
          >
            <CheckCheck size={20} color="#EC4899" />
            <Text className="text-pink-500 ml-1 text-sm">Mark all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
            <Bell size={32} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            No notifications
          </Text>
          <Text className="text-gray-500 text-center">
            You don&apos;t have any notifications right now. Come back later!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={["#EC4899"]}
              tintColor="#EC4899"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
