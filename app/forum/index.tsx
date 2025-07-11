import React, {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { questionApi, voteApi } from "@/apis/forum";
import { QuestionData } from "@/models/forum";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";

export default function ForumTab() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(
    null
  );
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [votingStates, setVotingStates] = useState<{
    [key: number]: { isVoting: boolean; userVote?: "UP" | "DOWN" };
  }>({});

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await questionApi.getAll();
      setQuestions(data);

      // Fetch voting states for all questions
      if (user && data.length > 0) {
        const votingData: {
          [key: number]: { isVoting: boolean; userVote?: "UP" | "DOWN" };
        } = {};
        for (const question of data) {
          try {
            const votes = await voteApi.getByQuestionId(question.id);
            const userVote = votes.find(
              (vote) => vote.customerProfileId === Number(user.id)
            );
            votingData[question.id] = {
              isVoting: false,
              userVote: userVote?.voteType,
            };
          } catch {
            votingData[question.id] = { isVoting: false };
          }
        }
        setVotingStates(votingData);
      }
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load questions",
        text2: "An unexpected error occurred.",
        position: "top",
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  };

  const handleVote = async (questionId: number, voteType: "UP" | "DOWN") => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to vote",
        position: "top",
      });
      return;
    }

    const currentVoteState = votingStates[questionId];
    if (currentVoteState?.isVoting) return;

    // Update voting state immediately for better UX
    setVotingStates((prev) => ({
      ...prev,
      [questionId]: { isVoting: true, userVote: currentVoteState?.userVote },
    }));

    try {
      // If user already voted the same way, remove the vote
      if (currentVoteState?.userVote === voteType) {
        // Find and delete the existing vote
        const votes = await voteApi.getByQuestionId(questionId);
        const userVote = votes.find(
          (vote) => vote.customerProfileId === Number(user.id)
        );
        if (userVote) {
          await voteApi.delete(userVote.id);
        }

        setVotingStates((prev) => ({
          ...prev,
          [questionId]: { isVoting: false, userVote: undefined },
        }));
      } else {
        // If user voted differently before, delete old vote first
        if (currentVoteState?.userVote) {
          const votes = await voteApi.getByQuestionId(questionId);
          const userVote = votes.find(
            (vote) => vote.customerProfileId === Number(user.id)
          );
          if (userVote) {
            await voteApi.delete(userVote.id);
          }
        }

        // Create new vote
        await voteApi.create({
          vote_type: voteType,
          question_id: questionId,
        });

        setVotingStates((prev) => ({
          ...prev,
          [questionId]: { isVoting: false, userVote: voteType },
        }));
      }

      // Refresh questions to get updated vote counts
      await fetchQuestions();
    } catch (error) {
      console.error("Error voting:", error);
      Toast.show({
        type: "error",
        text1: "Vote Failed",
        text2: "Unable to register your vote",
        position: "top",
      });

      // Revert voting state on error
      setVotingStates((prev) => ({
        ...prev,
        [questionId]: { isVoting: false, userVote: currentVoteState?.userVote },
      }));
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!user) return;

    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await questionApi.delete(questionId);
              Toast.show({
                type: "success",
                text1: "Question Deleted",
                text2: "Your question has been removed",
                position: "top",
              });
              await fetchQuestions();
            } catch {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: "Unable to delete question",
                position: "top",
              });
            }
          },
        },
      ]
    );
  };

  const handleEditQuestion = (question: QuestionData) => {
    setEditingQuestion(question);
    setNewQuestionTitle(question.title);
    setNewQuestionContent(question.content);
    setShowCreateModal(true);
  };

  const handleCreateOrUpdateQuestion = async () => {
    if (!user || !newQuestionTitle.trim() || !newQuestionContent.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please fill in all fields",
        position: "top",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newQuestionTitle.trim());
      formData.append("content", newQuestionContent.trim());

      if (editingQuestion) {
        // Update existing question
        await questionApi.update(editingQuestion.id, formData);
        Toast.show({
          type: "success",
          text1: "Question Updated",
          text2: "Your question has been updated successfully",
          position: "top",
        });
      } else {
        // Create new question
        await questionApi.create(formData);
        Toast.show({
          type: "success",
          text1: "Question Created",
          text2: "Your question has been posted successfully",
          position: "top",
        });
      }

      // Reset form and close modal
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setEditingQuestion(null);
      setShowCreateModal(false);

      // Refresh questions
      await fetchQuestions();
    } catch {
      Toast.show({
        type: "error",
        text1: editingQuestion ? "Update Failed" : "Post Failed",
        text2: "Unable to save your question",
        position: "top",
      });
    }
  };

  const handleCreateQuestion = () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to create a question",
        position: "top",
      });
      return;
    }

    setEditingQuestion(null);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setShowCreateModal(true);
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
                        onPress={() => handleVote(question.id, "UP")}
                        className={`p-1 rounded active:bg-gray-100 ${
                          votingStates[question.id]?.userVote === "UP"
                            ? "bg-orange-100"
                            : ""
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            votingStates[question.id]?.userVote === "UP"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        >
                          ▲
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-xs font-bold text-gray-700 my-1 text-center">
                        {question._count?.votes || 0}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleVote(question.id, "DOWN")}
                        className={`p-1 rounded active:bg-gray-100 ${
                          votingStates[question.id]?.userVote === "DOWN"
                            ? "bg-orange-100"
                            : ""
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            votingStates[question.id]?.userVote === "DOWN"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        >
                          ▼
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Content Section */}
                    <View className="flex-1">
                      {/* Header with Owner Actions */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
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

                        {/* Owner Actions */}
                        {user &&
                          question.customerProfileId === Number(user.id) && (
                            <View className="flex-row">
                              <TouchableOpacity
                                onPress={() => handleEditQuestion(question)}
                                className="p-1 mr-1 rounded active:bg-gray-100"
                              >
                                <Text className="text-gray-500 text-xs">
                                  ✏️
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleDeleteQuestion(question.id)
                                }
                                className="p-1 rounded active:bg-gray-100"
                              >
                                <Text className="text-red-500 text-xs">🗑️</Text>
                              </TouchableOpacity>
                            </View>
                          )}
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

      {/* Create/Edit Question Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 justify-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg mx-4">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">
                {editingQuestion ? "Edit Question" : "Create Question"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Text className="text-gray-500 text-lg">×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="p-4">
              <TextInput
                value={newQuestionTitle}
                onChangeText={setNewQuestionTitle}
                placeholder="Question Title"
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
                multiline
                numberOfLines={2}
              />
              <TextInput
                value={newQuestionContent}
                onChangeText={setNewQuestionContent}
                placeholder="Describe your question..."
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
                multiline
                numberOfLines={4}
              />

              {/* Image upload button (coming soon) */}
              <TouchableOpacity className="bg-orange-500 rounded-lg px-4 py-2 mb-4">
                <Text className="text-white text-center text-sm font-semibold">
                  📸 Upload Image (Coming Soon)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-end px-4 py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                className="bg-gray-200 rounded-lg px-4 py-2 mr-2"
              >
                <Text className="text-gray-700 text-sm font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateOrUpdateQuestion}
                className="bg-orange-500 rounded-lg px-4 py-2"
              >
                <Text className="text-white text-sm font-semibold">
                  {editingQuestion ? "Update Question" : "Post Question"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}
