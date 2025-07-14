import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface QuickReplyProps {
  replies: string[];
  onReplyPress: (reply: string) => void;
}

export function QuickReplies({ replies, onReplyPress }: QuickReplyProps) {
  return (
    <View className="px-4 py-2">
      <Text className="text-sm text-gray-600 mb-2">Quick replies:</Text>
      <View className="flex-row flex-wrap">
        {replies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onReplyPress(reply)}
            className="bg-pink-50 border border-pink-200 rounded-full px-3 py-2 mr-2 mb-2"
          >
            <Text className="text-pink-600 text-sm">{reply}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

interface ChatHeaderProps {
  onClearChat?: () => void;
  onBack?: () => void;
}

export function ChatHeader({ onClearChat, onBack }: ChatHeaderProps) {
  return (
    <View className="px-4 py-3 border-b border-gray-200 bg-white">
      <View className="flex-row items-center">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
        )}
        <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center mr-3">
          <Ionicons name="chatbubbles" size={20} color="#ec4899" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            Gender Health Consultant
          </Text>
          <Text className="text-sm text-gray-500">
            AI Assistant • Always online
          </Text>
        </View>
      </View>
    </View>
  );
}

export function TypingIndicator() {
  return (
    <View className="px-4 py-2 flex-row items-center">
      <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mr-2">
        <Ionicons name="medical" size={16} color="#ec4899" />
      </View>
      <View className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-1 opacity-60" />
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-1 opacity-80" />
          <View className="w-2 h-2 rounded-full bg-gray-400" />
        </View>
        <Text className="text-xs text-gray-500 mt-1">Consulting...</Text>
      </View>
    </View>
  );
}
