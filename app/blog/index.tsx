import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import type { BlogPost } from "@/models/blog";
import { blogApi } from "../../apis/blog";

export default function BlogTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll(currentPage, 10);
      setBlogs(response);
      console.log("✅ Fetched", response.length, "blogs");
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading blogs...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">Health Blog</Text>
        <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
          <Text className="text-blue-500 font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <View className="flex-row items-center">
          <Text className="text-xl mr-3">🔍</Text>
          <Text className="text-gray-600 flex-1">
            Search health articles...
          </Text>
        </View>
      </View>
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Featured Articles
      </Text>
      <View className="space-y-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <TouchableOpacity
              key={blog.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              onPress={() => router.push(`/blog/${blog.id}`)}
            >
              <View className="flex-row">
                <View className="w-20 h-20 bg-gray-200 rounded-lg mr-4 items-center justify-center">
                  <Image
                    source={{
                      uri: blog.image,
                    }}
                    className="w-full h-full rounded-lg"
                    style={{ width: 80, height: 80 }}
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-semibold text-gray-800 mb-1"
                    numberOfLines={2}
                  >
                    {blog.title}
                  </Text>
                  <Text
                    className="text-gray-600 text-sm mb-2"
                    numberOfLines={2}
                  >
                    {blog.content}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-xs">
                      {new Date(blog.date).toLocaleDateString()}
                    </Text>
                    {blog.staff && (
                      <Text className="text-gray-500 text-xs ml-2">
                        by {blog.staff.name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
            <Text className="text-4xl mb-4">📰</Text>
            <Text className="text-gray-600 text-center mb-2">
              No articles found
            </Text>
            <Text className="text-gray-500 text-sm text-center">
              Check back later for new health articles
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
