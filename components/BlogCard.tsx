import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  image: string;
  author?: string;
}

export default function BlogCard({
  id,
  title,
  content,
  date,
  tags,
  image,
  author,
}: BlogCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/blog/${id}` as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-xs text-gray-400">
          {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
        {author && (
          <Text className="text-xs text-gray-500 italic">By {author}</Text>
        )}
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text
            className="text-base font-bold text-gray-800 mb-1"
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            numberOfLines={3}
            className="text-gray-600 text-sm leading-relaxed"
          >
            {content}
          </Text>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <View className="flex-row flex-wrap mt-3">
              {tags.slice(0, 3).map((tag, index) => (
                <Text
                  key={index}
                  className="bg-pink-100 text-pink-600 text-xs rounded-full px-2 py-1 mr-2 mb-1"
                >
                  #{tag}
                </Text>
              ))}
              {tags.length > 3 && (
                <Text className="text-gray-400 text-xs py-1">
                  +{tags.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="w-20 h-20 rounded-lg bg-gray-100"
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
