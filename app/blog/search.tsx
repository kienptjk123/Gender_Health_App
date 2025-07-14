import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { blogApi } from "../../apis/blog";
import type { BlogPost } from "@/models/blog";
import { Ionicons } from "@expo/vector-icons";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const [page1, page2] = await Promise.all([
        blogApi.getAll(1, 10),
        blogApi.getAll(2, 10),
      ]);
      const allData = [...page1, ...page2];
      setAllBlogs(allData);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 30 }}>
      {/* Header */}
      <View className="bg-white px-6 pt-4 pb-6 shadow-sm">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-4 shadow-sm"
          >
            <Ionicons name="arrow-back" size={18} color="#EC4899" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-2xl font-bold text-pink-400 mb-1">
              Search Articles
            </Text>
            <Text className="text-pink-300 text-sm">
              Find health & wellness content
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <Text className="text-pink-400 text-lg">🔍</Text>
          </View>
          <TextInput
            placeholder="Search for articles..."
            placeholderTextColor="#f472b6"
            className="bg-pink-50 rounded-2xl pl-12 pr-4 py-4 text-pink-400 text-base border-2 border-pink-200 shadow-sm"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-6 bg-gray-50">
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white p-8 rounded-3xl shadow-sm">
              <ActivityIndicator size="large" color="#f472b6" />
              <Text className="text-pink-400 text-lg font-semibold mt-4 text-center">
                Loading articles...
              </Text>
            </View>
          </View>
        ) : (
          <>
            {searchQuery.trim() === "" ? (
              <View className="bg-white rounded-3xl p-8 items-center mt-8 shadow-sm border border-pink-100">
                <View className="w-20 h-20 bg-pink-100 rounded-full items-center justify-center mb-6">
                  <Text className="text-4xl">🔍</Text>
                </View>
                <Text className="text-pink-400 text-2xl font-bold text-center mb-3">
                  Search for Articles
                </Text>
                <Text className="text-pink-300 text-center leading-relaxed">
                  Enter keywords above to find articles about health, wellness,
                  and more topics.
                </Text>
              </View>
            ) : (
              <>
                <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-pink-100">
                  <Text className="text-lg font-bold text-pink-400">
                    Found {searchResults.length} result
                    {searchResults.length !== 1 ? "s" : ""}
                  </Text>
                  <Text className="text-pink-300 text-sm mt-1">
                    for &quot;{searchQuery}&quot;
                  </Text>
                </View>

                {searchResults.length > 0 ? (
                  <View className="space-y-4">
                    {searchResults.map((blog) => (
                      <TouchableOpacity
                        key={blog.id}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 mb-4"
                        onPress={() => router.push(`/blog/${blog.id}`)}
                      >
                        <View className="flex-row">
                          <View className="w-24 h-24 border border-pink-100 rounded-xl overflow-hidden mr-4 shadow-sm">
                            <Image
                              source={{ uri: blog.image }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                          <View className="flex-1">
                            <View className="bg-pink-100 px-3 py-1 rounded-full self-start mb-3">
                              <Text className="text-pink-600 text-xs font-bold uppercase">
                                {blog.tags?.[0]?.tag?.name || "Health"}
                              </Text>
                            </View>
                            <Text
                              className="text-pink-400 font-bold text-base leading-tight mb-3"
                              numberOfLines={2}
                            >
                              {blog.title}
                            </Text>
                            <View className="flex-row items-center">
                              <View className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-pink-200">
                                <Image
                                  source={{ uri: blog.staff?.avatar }}
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              </View>
                              <Text className="text-pink-400 text-xs font-medium">
                                {blog.staff?.name || "Author"} •{" "}
                                {getTimeAgo(blog.date)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 items-center">
                    <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
                      <Text className="text-4xl">😔</Text>
                    </View>
                    <Text className="text-pink-400 text-xl font-bold text-center mb-3">
                      No articles found
                    </Text>
                    <Text className="text-pink-300 text-center leading-relaxed">
                      Try searching with different keywords or check your
                      spelling.
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
