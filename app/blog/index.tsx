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
import { Bookmark, Search, Bell } from "lucide-react-native";
import { SafeArea } from "@/components/SafeArea";

const { width } = Dimensions.get("window");

export default function BlogTab() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
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
      setFilteredBlogs(popularResponse);
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
      <SafeArea backgroundColor="#ffffff" statusBarStyle="dark-content">
        <View className="flex-1 justify-center items-center bg-gray-50">
          <View className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Text className="text-2xl">💖</Text>
            </View>
            <Text className="text-lg text-pink-400 font-semibold text-center">
              Loading blogs...
            </Text>
          </View>
        </View>
      </SafeArea>
    );
  }

  const renderFeaturedItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      onPress={() => router.push(`/blog/${item.id}`)}
      className="mr-4"
      style={{ width: width - 80 }}
    >
      <View className="bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-100">
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full border border-pink-200 p-2 shadow-md">
            <Bookmark size={20} color="#f472b6" />
          </TouchableOpacity>
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-900/80 via-pink-800/60 to-transparent p-6">
            <Text className="text-white text-xl font-bold mb-3 leading-tight shadow-lg">
              {item.title}
            </Text>
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.staff?.avatar }}
                className="w-8 h-8 rounded-full mr-3 border-2 border-white/50"
                resizeMode="cover"
              />
              <View>
                <Text className="text-white font-medium shadow-sm">
                  {item.staff?.name}
                </Text>
                <Text className="text-white/80 text-sm">
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
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">📰</Text>
              </View>
              <View>
                <Text className="text-2xl font-bold text-pink-400">
                  Breaking News
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
              <Bell size={20} color="#f472b6" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => router.push("/blog/search")}
            className="flex-row items-center bg-pink-50 rounded-2xl px-4 py-3 border border-pink-200"
          >
            <Search size={20} color="#f472b6" />
            <Text className="flex-1 ml-3 text-pink-400">
              Find interesting news
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 py-3 bg-white">
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
            <Text className="text-xl font-bold text-pink-400">Recommended</Text>
          </View>

          {/* Popular Articles */}
          <View className="space-y-4">
            {filteredBlogs.map((blog, index) => (
              <TouchableOpacity
                key={blog.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 mb-3"
                onPress={() => router.push(`/blog/${blog.id}`)}
              >
                <View className="flex-row">
                  <View className="w-20 h-20 border border-pink-100 rounded-xl overflow-hidden mr-4">
                    <Image
                      source={{ uri: blog.image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1 mr-2">
                        <View className="bg-pink-100 px-2 py-1 rounded-md self-start mb-2">
                          <Text className="text-pink-600 text-xs font-semibold uppercase">
                            {blog.tags?.[0]?.tag?.name || "Health"}
                          </Text>
                        </View>
                        <Text
                          className="text-pink-400 font-semibold text-base leading-tight"
                          numberOfLines={2}
                        >
                          {blog.title}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between mt-3">
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: blog.staff?.avatar }}
                          className="w-5 h-5 rounded-full mr-2"
                          resizeMode="cover"
                        />
                        <Text className="text-pink-400 text-xs font-medium">
                          {blog.staff?.name || "McKinney"} •{" "}
                          {getTimeAgo(blog.date)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* No articles state */}
          {filteredBlogs.length === 0 && !loading && (
            <View className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 items-center mt-8">
              <View className="w-20 h-20 bg-pink-100 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🔍</Text>
              </View>
              <Text className="text-pink-400 text-xl font-bold text-center mb-2">
                No articles found
              </Text>
              <Text className="text-pink-300 text-center">
                Try searching for different keywords
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
