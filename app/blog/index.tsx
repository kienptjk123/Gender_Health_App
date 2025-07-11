import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import type { BlogPost } from "@/models/blog";
import { blogApi } from "../../apis/blog";
import { Bookmark, Clock, Eye } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function BlogTab() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Call page 1 for featured blogs
      const [featuredResponse, popularResponse] = await Promise.all([
        blogApi.getAll(1, 5),
        blogApi.getAll(2, 5),
      ]);

      setFeaturedBlogs(featuredResponse);
      setPopularBlogs(popularResponse);
      console.log(
        "✅ Fetched",
        featuredResponse.length,
        "featured blogs and",
        popularResponse.length,
        "popular blogs"
      );
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
      .toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading blogs...</Text>
      </View>
    );
  }

  const renderFeaturedItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      onPress={() => router.push(`/blog/${item.id}`)}
      className="mr-4"
      style={{ width: width - 80 }}
    >
      <View className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute top-4 right-4 bg-white backdrop-blur-sm rounded-full border border-gray-500 p-2">
            <Bookmark size={20} color="black" />
          </TouchableOpacity>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <Text className="text-black text-xl font-bold mb-3 leading-tight">
              {item.title}
            </Text>
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.staff?.avatar }}
                className="w-8 h-8 rounded-full mr-3"
                resizeMode="cover"
              />
              <View>
                <Text className="text-black font-medium">
                  {item.staff?.name}
                </Text>
                <Text className="text-black /70 text-sm">
                  {getTimeAgo(item.date)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-2 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-gray-900">Blog</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6 py-6">
        {/* Featured Articles Carousel */}
        {featuredBlogs.length > 0 && (
          <View className="mb-8">
            <FlatList
              data={featuredBlogs}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 64}
              decelerationRate="fast"
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 24 }}
            />
          </View>
        )}

        {/* Popular Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Popular</Text>
          <TouchableOpacity>
            <Text className="text-orange-500 font-medium">Show all</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Articles */}
        <View className="space-y-4">
          {popularBlogs.map((blog, index) => (
            <TouchableOpacity
              key={blog.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              onPress={() => router.push(`/blog/${blog.id}`)}
            >
              <View className="flex-row">
                <View className="w-16 h-16 rounded-xl overflow-hidden mr-4">
                  <Image
                    source={{ uri: blog.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-orange-500 text-xs font-medium uppercase mb-1">
                        {blog.tags?.[0]?.tag?.name || "HEALTH"}
                      </Text>
                      <Text
                        className="text-gray-900 font-semibold text-base leading-tight"
                        numberOfLines={2}
                      >
                        {blog.title}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Clock size={14} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {getTimeAgo(blog.date)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Eye size={14} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {Math.floor(Math.random() * 1000) + 100}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* No articles state */}
        {featuredBlogs.length === 0 && popularBlogs.length === 0 && (
          <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center mt-8">
            <Text className="text-6xl mb-4">📰</Text>
            <Text className="text-gray-900 text-xl font-semibold text-center mb-2">
              No articles found
            </Text>
            <Text className="text-gray-500 text-center">
              Check back later for new health articles
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
