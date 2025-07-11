import React, {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { questionApi } from "@/apis/forum";
import { QuestionData } from "@/models/forum";
import Toast from "react-native-toast-message";

export default function ForumTab() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching forum questions...");
      const data = await questionApi.getAll();
      console.log("✅ Questions fetched:", data.length);
      console.log("📝 Sample question:", data[0]);
      setQuestions(data);
    } catch (error: any) {
      console.error("❌ Error fetching questions:", error);
      console.error("📊 Error type:", typeof error);
      console.error("🔍 Error details:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to load questions";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      Toast.show({
        type: "error",
        text1: "Failed to load questions",
        text2: errorMessage,
        position: "top",
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  };

  const handleCreateQuestion = () => {
    console.log("Creating new question...");
    Toast.show({
      type: "info",
      text1: "Feature Coming Soon",
      text2: "Question creation will be available soon",
      position: "top",
    });
  };

  const handleQuestionPress = (questionId: number) => {
    console.log("Opening question:", questionId);
    Toast.show({
      type: "info",
      text1: "Feature Coming Soon",
      text2: "Question details will be available soon",
      position: "top",
    });
  };

  const handleVote = (questionId: number, voteType: "up" | "down") => {
    console.log(`Voting ${voteType} on question:`, questionId);
    Toast.show({
      type: "info",
      text1: "Feature Coming Soon",
      text2: "Voting will be available soon",
      position: "top",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return "now";
    }
  };

  const getQuestionCategory = (question: QuestionData) => {
    const content = (question.title + " " + question.content).toLowerCase();
    if (
      content.includes("question") ||
      content.includes("how") ||
      content.includes("what") ||
      content.includes("why")
    ) {
      return "questions";
    } else if (
      content.includes("experience") ||
      content.includes("story") ||
      content.includes("journey")
    ) {
      return "experiences";
    } else if (
      content.includes("tip") ||
      content.includes("advice") ||
      content.includes("recommend")
    ) {
      return "tips";
    } else if (
      content.includes("support") ||
      content.includes("help") ||
      content.includes("struggling")
    ) {
      return "support";
    }
    return "questions";
  };

  const filteredQuestions =
    activeCategory === "all"
      ? questions
      : questions.filter(
          (question) => getQuestionCategory(question) === activeCategory
        );

  const categories = [
    { id: "all", name: "All", icon: "🏠" },
    { id: "questions", name: "Questions", icon: "❓" },
    { id: "experiences", name: "Experiences", icon: "✨" },
    { id: "tips", name: "Tips", icon: "💡" },
    { id: "support", name: "Support", icon: "🤝" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-gray-900">
            r/WomensHealth
          </Text>
          <Text className="text-sm text-gray-500 ml-2">
            • {questions.length} posts
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View className="bg-white border-b border-gray-200 px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 rounded-full flex-row items-center ${
                  activeCategory === category.id
                    ? "bg-orange-500"
                    : "bg-gray-100"
                }`}
              >
                <Text className="text-xs mr-1">{category.icon}</Text>
                <Text
                  className={`text-xs font-medium ${
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
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#f97316"]}
            tintColor="#f97316"
          />
        }
      >
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-gray-600 mt-4">Loading posts...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">�</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              No posts yet
            </Text>
            <Text className="text-gray-600 text-center mb-6 px-8">
              Be the first to share something with the community!
            </Text>
            <TouchableOpacity
              className="bg-orange-500 px-6 py-3 rounded-full"
              onPress={handleCreateQuestion}
            >
              <Text className="text-white font-semibold">
                Create First Post
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Forum Questions */}
        {!loading && filteredQuestions.length > 0 && (
          <View>
            {filteredQuestions.map((question, index) => (
              <View
                key={question.id}
                className={`bg-white ${
                  index === 0 ? "" : "border-t border-gray-200"
                }`}
              >
                <TouchableOpacity
                  onPress={() => handleQuestionPress(question.id)}
                  className="flex-1 active:bg-gray-50"
                >
                  <View className="flex-row p-3">
                    {/* Vote Section */}
                    <View className="items-center mr-3 pt-1 w-10">
                      <TouchableOpacity
                        onPress={() => handleVote(question.id, "up")}
                        className="p-1 rounded active:bg-gray-100"
                      >
                        <Text className="text-gray-400 text-base">▲</Text>
                      </TouchableOpacity>
                      <Text className="text-xs font-bold text-gray-700 my-1 text-center">
                        {question._count?.votes || 0}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleVote(question.id, "down")}
                        className="p-1 rounded active:bg-gray-100"
                      >
                        <Text className="text-gray-400 text-base">▼</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Content Section */}
                    <View className="flex-1">
                      {/* Header */}
                      <View className="flex-row items-center mb-2">
                        <View className="w-5 h-5 bg-orange-100 rounded-full items-center justify-center mr-2">
                          <Text className="text-orange-600 font-bold text-xs">
                            {question.customerProfile?.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-600 font-medium">
                          r/WomensHealth
                        </Text>
                        <Text className="text-xs text-gray-400 mx-1">•</Text>
                        <Text className="text-xs text-gray-500">
                          Posted by u/
                          {question.customerProfile?.username || "anonymous"}
                        </Text>
                        <Text className="text-xs text-gray-400 mx-1">•</Text>
                        <Text className="text-xs text-gray-500">
                          {formatTime(question.createdAt)}
                        </Text>
                      </View>

                      {/* Title */}
                      <Text className="text-base font-medium text-gray-900 mb-2 leading-5">
                        {question.title}
                      </Text>

                      {/* Content */}
                      <Text
                        className="text-sm text-gray-700 mb-3 leading-5"
                        numberOfLines={3}
                      >
                        {question.content}
                      </Text>

                      {/* Image */}
                      {question.image && (
                        <View className="mb-3">
                          <Image
                            source={{ uri: question.image }}
                            className="w-full h-48 rounded-lg"
                            resizeMode="cover"
                          />
                        </View>
                      )}

                      {/* Actions */}
                      <View className="flex-row items-center pt-2">
                        <TouchableOpacity className="flex-row items-center mr-4 py-1 px-2 rounded active:bg-gray-100">
                          <Text className="text-gray-400 text-base mr-1">
                            💬
                          </Text>
                          <Text className="text-xs text-gray-500 font-medium">
                            {question._count?.replies || 0}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center mr-4 py-1 px-2 rounded active:bg-gray-100">
                          <Text className="text-gray-400 text-base mr-1">
                            📤
                          </Text>
                          <Text className="text-xs text-gray-500 font-medium">
                            Share
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center py-1 px-2 rounded active:bg-gray-100">
                          <Text className="text-gray-400 text-base mr-1">
                            ⭐
                          </Text>
                          <Text className="text-xs text-gray-500 font-medium">
                            Save
                          </Text>
                        </TouchableOpacity>

                        <View className="flex-1" />

                        <TouchableOpacity className="py-1 px-2 rounded active:bg-gray-100">
                          <Text className="text-gray-400 text-base">⋯</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          className="w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
          onPress={handleCreateQuestion}
        >
          <Text className="text-white font-bold text-xl">+</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
}
