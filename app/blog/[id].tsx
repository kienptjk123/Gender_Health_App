import { SafeArea } from "@/components/SafeArea";
import { BlogPost } from "@/models/blog";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { blogApi } from "../../apis/blog";

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
        <View className="flex-1 justify-center items-center bg-pink-50">
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 mx-4">
            <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center mb-4 mx-auto">
              <ActivityIndicator size="large" color="#EC4899" />
            </View>
            <Text className="text-pink-600 font-semibold text-center">
              Loading blog...
            </Text>
          </View>
        </View>
      </SafeArea>
    );
  }

  if (error) {
    return (
      <SafeArea>
        <View className="flex-1 justify-center items-center bg-pink-50 px-4">
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 items-center">
            <Text className="text-4xl mb-4">😔</Text>
            <Text className="text-lg font-semibold text-pink-600 mb-2">
              Error Loading Blog
            </Text>
            <Text className="text-pink-400 text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={() => {
                fetchBlog();
              }}
              className="bg-pink-500 px-6 py-3 rounded-xl mb-2 shadow-md"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-pink-200 px-6 py-3 rounded-xl"
            >
              <Text className="text-pink-600 font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeArea>
    );
  }

  // No blog found state
  if (!blog) {
    console.log("❌ Blog is null/undefined, rendering not found");
    return (
      <SafeArea>
        <View className="flex-1 justify-center items-center bg-pink-50 px-4">
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-pink-100 items-center">
            <Text className="text-4xl mb-4">📰</Text>
            <Text className="text-lg font-semibold text-pink-600 mb-2">
              Blog not found
            </Text>
            <Text className="text-pink-400 text-center mb-4">
              The blog you are looking for does not exist.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-pink-500 px-6 py-3 rounded-xl shadow-md"
            >
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeArea>
    );
  }

  console.log("✅ Rendering blog:", blog.title);

  // Main blog content
  return (
    <SafeArea backgroundColor="#FFCBD7" statusBarStyle="light-content">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View className="flex-1 bg-pink-50">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View className="relative h-80">
            {blog.image && (
              <Image
                source={{ uri: blog.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
            <LinearGradient
              colors={[
                "transparent",
                "rgba(110, 109, 109, 0.3)",
                "rgba(121, 117, 119, 0.7)",
              ]}
              className="absolute inset-0"
            />

            {/* Header with back button */}
            <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md"
              >
                <Ionicons name="arrow-back" size={24} color="#EC4899" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/90 justify-center items-center shadow-md">
                <Ionicons name="bookmark-outline" size={24} color="#EC4899" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Container */}
          <View className="bg-white rounded-t-3xl -mt-6 pt-8 px-5">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <View className="flex-row flex-wrap mb-4">
                {blog.tags.map((tagObj, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-pink-100 px-3 py-1.5 rounded-full mr-2 mb-2"
                  >
                    <Ionicons name="pricetag" size={12} color="#EC4899" />
                    <Text className="text-pink-600 text-xs font-semibold ml-1">
                      {tagObj.tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Title */}
            <Text className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
              {blog.title || "Untitled"}
            </Text>

            {/* Metadata */}
            <View className="bg-pink-50 rounded-2xl p-4 mb-6 border border-pink-100">
              <View className="flex-row items-center mb-3">
                {blog.staff?.avatar && (
                  <Image
                    source={{ uri: blog.staff.avatar }}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-pink-200"
                  />
                )}
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="person" size={14} color="#EC4899" />
                    <Text className="text-gray-900 font-semibold ml-1.5">
                      {blog.staff?.name || "Unknown Author"}
                    </Text>
                  </View>
                  <Text className="text-pink-500 text-sm font-medium">
                    Chuyên gia sức khỏe giới tính
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#EC4899" />
                <Text className="text-pink-600 text-sm ml-1.5 font-medium">
                  {formatDate(blog.date)}
                </Text>
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Ionicons name="book-outline" size={18} color="#EC4899" />
                <Text className="text-pink-600 font-medium ml-2">
                  5 phút đọc
                </Text>
              </View>

              <Text className="text-gray-700 text-base leading-7">
                {getContentText(blog.content) || "Không có nội dung"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeArea>
  );
}
