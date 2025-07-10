import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { blogApi } from "../../apis/blog";
import { BlogPost } from "@/models/blog";
import { Ionicons } from "@expo/vector-icons";
import { SafeArea } from "@/components/SafeArea";

function getContentText(content: string): string {
  try {
    const parsed = JSON.parse(content);
    const blocks = parsed?.blocks;
    if (Array.isArray(blocks)) {
      return blocks
        .map((block: any) => block.text)
        .join("\n\n")
        .replace(/\n{3,}/g, "\n\n");
    }
  } catch {}
  return content;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function BlogDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    } else {
      setError("No blog ID provided");
      setLoading(false);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await blogApi.getById(String(id));
      if (blogData) {
        setBlog(blogData);
      } else {
        setError("Blog not found");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load blog";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeArea>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#EC4899" />
          <Text className="text-gray-500 mt-2">Loading blog...</Text>
        </View>
      </SafeArea>
    );
  }

  if (error) {
    return (
      <SafeArea>
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-4xl mb-4">😔</Text>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Blog
          </Text>
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              fetchBlog();
            }}
            className="bg-rose-500 px-6 py-3 rounded-lg mb-2"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  // No blog found state
  if (!blog) {
    console.log("❌ Blog is null/undefined, rendering not found");
    return (
      <SafeArea>
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-4xl mb-4">📰</Text>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Blog not found
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            The blog you are looking for does not exist.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-rose-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  console.log("✅ Rendering blog:", blog.title);

  // Main blog content
  return (
    <SafeArea>
      <View className="flex-1 bg-white">
        {/* Header with back button */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#EC4899" />
            <Text className="ml-2 text-gray-800">Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Blog Image */}
          {blog.image && (
            <Image
              source={{ uri: blog.image }}
              className="w-full h-64 bg-gray-200"
              resizeMode="cover"
              onError={(e) =>
                console.log("❌ Image failed to load:", e.nativeEvent.error)
              }
            />
          )}

          {/* Blog Content */}
          <View className="px-4 py-4">
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
              {blog.title || "Untitled"}
            </Text>

            {/* Metadata */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">
                  {formatDate(blog.date)}
                </Text>
                {blog.staff && (
                  <Text className="text-sm text-gray-600 italic">
                    By {blog.staff.name}
                  </Text>
                )}
              </View>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <View className="flex-row flex-wrap justify-end flex-1 ml-4">
                  {blog.tags.map((tagObj, index) => (
                    <Text
                      key={index}
                      className="bg-pink-100 text-pink-600 text-xs rounded-full px-3 py-1 ml-1 mb-1"
                    >
                      #{tagObj.tag.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Content */}
            <Text className="text-base text-gray-700 leading-relaxed mb-6">
              {getContentText(blog.content) || "No content available"}
            </Text>

            {blog.staff && (
              <View className="mt-8 p-4 bg-gray-50 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  About the Author
                </Text>
                <View className="flex-row items-center">
                  {blog.staff.avatar && (
                    <Image
                      source={{ uri: blog.staff.avatar }}
                      className="w-12 h-12 rounded-full mr-3 bg-gray-200"
                      onError={(e) =>
                        console.log(
                          "❌ Avatar failed to load:",
                          e.nativeEvent.error
                        )
                      }
                    />
                  )}
                  <View>
                    <Text className="font-semibold text-gray-800">
                      {blog.staff.name}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Health & Wellness Expert
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeArea>
  );
}
