import React, { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
// import { questionApi } from "@/apis/forum";
// import { QuestionData } from "@/models/forum";

export default function ForumTab() {
  const [activeCategory, setActiveCategory] = useState("all");

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  // const fetchQuestions = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await questionApi.getAll();
  //     setQuestions(data);
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const categories = [
    { id: "all", name: "All", icon: "💬" },
    { id: "questions", name: "Questions", icon: "❓" },
    { id: "experiences", name: "Experiences", icon: "✨" },
    { id: "tips", name: "Tips", icon: "💡" },
    { id: "support", name: "Support", icon: "🤝" },
  ];

  const forumPosts = [
    {
      id: 1,
      title: "How to track irregular periods?",
      author: "Sarah123",
      category: "questions",
      replies: 12,
      likes: 8,
      time: "2h ago",
      content:
        "I've been having irregular periods for the past 3 months. Any tips on tracking?",
      isAnswered: true,
    },
    {
      id: 2,
      title: "My experience with period pain management",
      author: "HealthyMom",
      category: "experiences",
      replies: 25,
      likes: 34,
      time: "4h ago",
      content:
        "Sharing what worked for me after years of struggling with period pain...",
      isAnswered: false,
    },
    {
      id: 3,
      title: "Best apps for fertility tracking",
      author: "TechLover",
      category: "tips",
      replies: 18,
      likes: 22,
      time: "1d ago",
      content:
        "Here are my top 5 fertility tracking apps with pros and cons...",
      isAnswered: false,
    },
    {
      id: 4,
      title: "Feeling overwhelmed with TTC journey",
      author: "HopefulMama",
      category: "support",
      replies: 31,
      likes: 45,
      time: "2d ago",
      content: "It's been 8 months and I'm starting to feel really stressed...",
      isAnswered: false,
    },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === activeCategory);

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          Community Forum
        </Text>
        <TouchableOpacity className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
          <Text className="text-purple-500 font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <View className="flex-row space-x-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                activeCategory === category.id ? "bg-purple-500" : "bg-gray-100"
              }`}
            >
              <Text className="text-sm mr-1">{category.icon}</Text>
              <Text
                className={`text-sm font-medium ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Forum Stats */}
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-500">2.5k</Text>
            <Text className="text-gray-600 text-sm">Members</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">1.2k</Text>
            <Text className="text-gray-600 text-sm">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-500">340</Text>
            <Text className="text-gray-600 text-sm">Today</Text>
          </View>
        </View>
      </View>

      {/* Forum Posts */}
      <View className="space-y-4">
        {filteredPosts.map((post) => (
          <TouchableOpacity
            key={post.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-start mb-3">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="text-purple-500 font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="font-medium text-gray-800 mr-2">
                    {post.author}
                  </Text>
                  <Text className="text-gray-500 text-xs">{post.time}</Text>
                  {post.isAnswered && (
                    <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                      <Text className="text-green-600 text-xs">Answered</Text>
                    </View>
                  )}
                </View>
                <Text className="font-semibold text-gray-800 mb-2">
                  {post.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                  {post.content}
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-4">
                    <Text className="text-gray-500 text-xs mr-1">💬</Text>
                    <Text className="text-gray-500 text-xs">
                      {post.replies}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-xs mr-1">❤️</Text>
                    <Text className="text-gray-500 text-xs">{post.likes}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Tags */}
      <Text className="text-lg font-semibold text-gray-800 mb-4 mt-6">
        Popular Tags
      </Text>
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row flex-wrap">
          {[
            "#PeriodTracking",
            "#PregnancyTips",
            "#FertilityJourney",
            "#WomensHealth",
            "#MentalHealth",
            "#Nutrition",
            "#Exercise",
            "#SelfCare",
          ].map((tag, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-gray-700 text-sm">{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
