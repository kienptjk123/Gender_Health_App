import { questionApi, voteApi } from "@/apis/forum";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionData } from "@/models/forum";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function ForumTab() {
  const { user } = useAuth();
  const router = useRouter();
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [votingStates, setVotingStates] = useState<{
    [key: number]: {
      isVoting: boolean;
      isLiked: boolean;
      userVoteId?: number;
      totalLikes: number;
    };
  }>({});
  const [showMenuForQuestion, setShowMenuForQuestion] = useState<number | null>(
    null
  );

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await questionApi.getAll();
      setQuestions(data);

      // Fetch voting states for all questions
      if (user && data.length > 0) {
        const votingData: {
          [key: number]: {
            isVoting: boolean;
            isLiked: boolean;
            userVoteId?: number;
            totalLikes: number;
          };
        } = {};
        for (const question of data) {
          try {
            const response = await voteApi.getVoteByQuestionId(question.id);
            let votes: any[] = [];
            if (response && Array.isArray(response.data)) {
              votes = response.data;
            } else {
              votes = [];
            }
            const userVote = votes.find(
              (vote) => vote.userId === Number(user.id)
            );

            // Count total likes (only UP votes count as likes)
            const totalLikes = votes.filter(
              (vote) => vote.voteType === "UP"
            ).length;

            votingData[question.id] = {
              isVoting: false,
              isLiked: userVote?.voteType === "UP",
              userVoteId: userVote?.id,
              totalLikes: totalLikes,
            };
          } catch (error) {
            console.warn(
              `Failed to fetch votes for question ${question.id}:`,
              error
            );
            votingData[question.id] = {
              isVoting: false,
              isLiked: false,
              totalLikes: 0,
            };
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
    setShowMenuForQuestion(null); // Close any open menu
    await fetchQuestions();
    setRefreshing(false);
  };

  const handleVote = async (questionId: number) => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to like posts",
        position: "top",
      });
      return;
    }

    const currentVoteState = votingStates[questionId];
    if (currentVoteState?.isVoting) return;

    // Ensure we have a valid voting state
    const safeCurrentState = currentVoteState || {
      isVoting: false,
      isLiked: false,
      totalLikes: 0,
    };

    // Set voting state
    setVotingStates((prev) => ({
      ...prev,
      [questionId]: {
        ...safeCurrentState,
        isVoting: true,
      },
    }));

    try {
      const response = await voteApi.getVoteByQuestionId(questionId);
      let votes: any[] = [];
      if (response && Array.isArray(response.data)) {
        votes = response.data;
      } else {
        votes = [];
      }
      console.log("🔄 Votes fetched for question state 1", votes);
      const userVote = votes.find((vote) => vote.userId === Number(user.id));

      let newTotalLikes = votes.filter((vote) => vote.voteType === "UP").length;
      let newIsLiked: boolean;
      let newUserVoteId: number | undefined;

      console.log(
        "🔄 Votes fetched for question state 2: checking type of userVote"
      );
      console.log("Fetch data:", userVote);

      if (userVote && userVote.voteType === "UP") {
        // User has already liked - remove the like
        await voteApi.deleteVote(userVote.id);
        newTotalLikes -= 1;
        newIsLiked = false;
        newUserVoteId = undefined;
      } else {
        if (userVote && userVote.voteType === "DOWN") {
          // Delete existing DOWN vote and create new UP vote
          await voteApi.deleteVote(userVote.id);
          const newVote = await voteApi.createVote({
            vote_type: "UP",
            question_id: questionId,
          });
          newTotalLikes =
            votes.filter((vote) => vote.voteType === "UP").length + 1;
          newIsLiked = true;
          newUserVoteId = newVote.data.id;
        } else {
          // Create new UP vote
          const newVote = await voteApi.createVote({
            vote_type: "UP",
            question_id: questionId,
            reply_id: undefined,
          });
          newTotalLikes += 1;
          newIsLiked = true;
          newUserVoteId = newVote.data.id;
        }
      }
      console.log("🔄 Votes fetched for question state 3: newTotalLikes");
      // Update voting state with new values
      setVotingStates((prev) => ({
        ...prev,
        [questionId]: {
          isVoting: false,
          isLiked: newIsLiked,
          userVoteId: newUserVoteId,
          totalLikes: newTotalLikes,
        },
      }));

      Toast.show({
        type: "success",
        text1: newIsLiked ? "Post Liked" : "Like Removed",
        text2: newIsLiked ? "You liked this post" : "You removed your like",
        position: "top",
      });
    } catch (error) {
      console.error("Error voting:", error);
      Toast.show({
        type: "error",
        text1: "Like Failed",
        text2: "Unable to register your like. Please try again.",
        position: "top",
      });

      // Revert voting state on error
      setVotingStates((prev) => ({
        ...prev,
        [questionId]: {
          ...safeCurrentState,
          isVoting: false,
        },
      }));
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!user) return;

    // Find the question to check ownership
    const question = questions.find((q) => q.id === questionId);
    if (
      !question ||
      question.customerProfileId !== Number(user.customer_profile_id)
    ) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You can only delete your own questions",
        position: "top",
      });
      return;
    }

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
              console.log("🗑️ Deleting question:", questionId);
              await questionApi.delete(questionId);
              Toast.show({
                type: "success",
                text1: "Question Deleted",
                text2: "Your question has been removed successfully",
                position: "top",
              });
              await fetchQuestions();
            } catch (error: any) {
              console.error("❌ Error deleting question:", error);
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: error?.message || "Unable to delete question",
                position: "top",
              });
            }
          },
        },
      ]
    );
  };

  const handleEditQuestion = (question: QuestionData) => {
    if (
      !user ||
      question.customerProfileId !== Number(user.customer_profile_id)
    ) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You can only edit your own questions",
        position: "top",
      });
      return;
    }

    setEditingQuestion(question);
    setNewQuestionTitle(question.title);
    setNewQuestionContent(question.content);
    setSelectedImage(question.image || null);
    setShowCreateModal(true);
  };

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2: "Please allow access to your photo library",
          position: "top",
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        Toast.show({
          type: "success",
          text1: "Image Selected",
          text2: "Image has been added to your post",
          position: "top",
        });
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Image Pick Failed",
        text2: "Unable to select image",
        position: "top",
      });
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    Toast.show({
      type: "info",
      text1: "Image Removed",
      text2: "Image has been removed from your post",
      position: "top",
    });
  };

  const handleCreateOrUpdateQuestion = async () => {
    if (!user || !newQuestionTitle.trim() || !newQuestionContent.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please fill in title and content",
        position: "top",
      });
      return;
    }

    try {
      setCreateLoading(true);
      console.log("🔄 Creating/updating question...");

      const formData = new FormData();
      formData.append("title", newQuestionTitle.trim());
      formData.append("content", newQuestionContent.trim());

      // Add image if selected
      if (selectedImage) {
        const imageUri = selectedImage;
        const filename = imageUri.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      if (editingQuestion) {
        // Update existing question
        console.log("✏️ Updating question:", editingQuestion.id);
        await questionApi.update(editingQuestion.id, formData);
        Toast.show({
          type: "success",
          text1: "Question Updated",
          text2: "Your question has been updated successfully",
          position: "top",
        });
      } else {
        // Create new question
        console.log("➕ Creating new question");
        await questionApi.create(formData);
        Toast.show({
          type: "success",
          text1: "Question Created",
          text2: "Your question has been posted successfully",
          position: "top",
        });
      }

      // Reset form and close modal
      handleCloseModal();

      // Refresh questions
      await fetchQuestions();
    } catch (error: any) {
      console.error("❌ Error saving question:", error);
      Toast.show({
        type: "error",
        text1: editingQuestion ? "Update Failed" : "Post Failed",
        text2: error?.message || "Unable to save your question",
        position: "top",
      });
    } finally {
      setCreateLoading(false);
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
    setSelectedImage(null);
    setShowCreateModal(true);
  };

  const handleQuestionPress = (questionId: number) => {
    console.log("Opening question:", questionId);
    router.push({
      pathname: "/forum/[id]",
      params: { id: questionId.toString() },
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

  const toggleQuestionMenu = (questionId: number) => {
    setShowMenuForQuestion((prev) => (prev === questionId ? null : questionId));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingQuestion(null);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setSelectedImage(null);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
            <Text className="text-lg">🏥</Text>
          </View>
          <View>
            <Text className="text-2xl font-bold text-pink-400">Forum</Text>
          </View>
        </View>
      </View>

      <View className="bg-white border-b border-gray-100 px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-1 space-x-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  setShowMenuForQuestion(null); // Close any open menu
                  setActiveCategory(category.id);
                }}
                className={`px-3 py-1.5 rounded-full flex-row items-center ${
                  activeCategory === category.id ? "bg-pink-400" : "bg-pink-100"
                }`}
              >
                <Text className="text-xs mr-1">{category.icon}</Text>
                <Text
                  className={`text-xs font-medium ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-pink-600"
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
              className="bg-pink-400 px-6 py-3 rounded-full"
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
                  index === 0 ? "" : "border-t border-pink-100"
                }`}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowMenuForQuestion(null); // Close any open menu
                    handleQuestionPress(question.id);
                  }}
                  className="flex-1 active:bg-pink-50"
                >
                  <View className="flex-row px-6 py-4">
                    {/* Content Section */}
                    <View className="flex-1">
                      {/* Header with Owner Actions */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
                          <Image
                            source={{
                              uri: question.customerProfile?.avatar || "",
                            }}
                            className="w-5 h-5 rounded-full mr-2"
                            resizeMode="cover"
                          />
                          <Text className="text-xs text-gray-500">
                            Posted by
                            {question.customerProfile?.name || "anonymous"}
                          </Text>
                          <Text className="text-xs text-gray-400 mx-1">•</Text>
                          <Text className="text-xs text-gray-500">
                            {formatTime(question.createdAt)}
                          </Text>
                        </View>

                        {/* Owner Actions - Only show dots for question owner */}
                        {user &&
                          question.customerProfileId ===
                            Number(user.customer_profile_id) && (
                            <View className="relative">
                              <TouchableOpacity
                                onPress={() => toggleQuestionMenu(question.id)}
                                className="p-1 rounded active:bg-gray-100"
                              >
                                <Text className="text-gray-400 text-base">
                                  ⋯
                                </Text>
                              </TouchableOpacity>

                              {/* Dropdown Menu */}
                              {showMenuForQuestion === question.id && (
                                <View className="absolute top-8 right-0 bg-white border border-pink-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                  <TouchableOpacity
                                    onPress={() => {
                                      setShowMenuForQuestion(null);
                                      handleEditQuestion(question);
                                    }}
                                    className="flex-row items-center px-3 py-2 active:bg-pink-50"
                                  >
                                    <Text className="text-pink-400 text-sm mr-2">
                                      ✏️
                                    </Text>
                                    <Text className="text-gray-700 text-sm">
                                      Edit
                                    </Text>
                                  </TouchableOpacity>
                                  <View className="border-t border-pink-100" />
                                  <TouchableOpacity
                                    onPress={() => {
                                      setShowMenuForQuestion(null);
                                      handleDeleteQuestion(question.id);
                                    }}
                                    className="flex-row items-center px-3 py-2 active:bg-pink-50"
                                  >
                                    <Text className="text-red-500 text-sm mr-2">
                                      🗑️
                                    </Text>
                                    <Text className="text-gray-700 text-sm">
                                      Delete
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
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

                      {/* Like, Share, Replies - One Line Section */}
                      <View className="flex-row items-center justify-between py-2 border-t border-gray-100">
                        <View className="flex-row items-center flex-1">
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleVote(question.id);
                            }}
                            className="flex-row items-center py-2 px-3 rounded-full active:bg-pink-50"
                            disabled={votingStates[question.id]?.isVoting}
                          >
                            <Text
                              className={`text-xl mr-2 ${
                                votingStates[question.id]?.isVoting
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              {votingStates[question.id]?.isLiked ? "❤️" : "🤍"}
                            </Text>
                            <Text className="text-sm font-medium text-gray-700">
                              {votingStates[question.id]?.isVoting
                                ? "..."
                                : `${
                                    votingStates[question.id]?.totalLikes || 0
                                  } ${
                                    (votingStates[question.id]?.totalLikes ||
                                      0) === 1
                                      ? "like"
                                      : "likes"
                                  }`}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              // Could add share functionality here later
                            }}
                            className="flex-row items-center py-2 px-3 rounded-full active:bg-gray-50 ml-2"
                          >
                            <Text className="text-gray-400 text-base mr-1">
                              📤
                            </Text>
                            <Text className="text-xs text-gray-500 font-medium">
                              Share
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity className="flex-row items-center py-2 px-3 rounded active:bg-gray-100 ml-2">
                            <Text className="text-gray-400 text-base mr-1">
                              💬
                            </Text>
                            <Text className="text-xs text-gray-500 font-medium">
                              {question._count?.replies || 0} replies
                            </Text>
                          </TouchableOpacity>
                        </View>
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
          className="w-14 h-14 bg-pink-400 rounded-full items-center justify-center shadow-lg"
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
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg mx-4">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">
                {editingQuestion ? "Edit Question" : "Create Question"}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
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

              {/* Image Selection Section */}
              <View className="mb-4">
                {selectedImage ? (
                  <View>
                    <Image
                      source={{ uri: selectedImage }}
                      className="w-full h-48 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={pickImage}
                        className="flex-1 bg-blue-500 rounded-lg px-4 py-2"
                      >
                        <Text className="text-white text-center text-sm font-semibold">
                          📸 Change Image
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={removeImage}
                        className="flex-1 bg-red-500 rounded-lg px-4 py-2"
                      >
                        <Text className="text-white text-center text-sm font-semibold">
                          🗑️ Remove Image
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="bg-pink-400 rounded-lg px-4 py-2"
                  >
                    <Text className="text-white text-center text-sm font-semibold">
                      📸 Add Image from Gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-end px-4 py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleCloseModal}
                className="bg-gray-200 rounded-lg px-4 py-2 mr-2"
              >
                <Text className="text-gray-700 text-sm font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateOrUpdateQuestion}
                disabled={createLoading}
                className={`rounded-lg px-4 py-2 ${
                  createLoading ? "bg-gray-400" : "bg-pink-400"
                }`}
              >
                {createLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-sm font-semibold ml-2">
                      {editingQuestion ? "Updating..." : "Posting..."}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-sm font-semibold">
                    {editingQuestion ? "Update Question" : "Post Question"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}
