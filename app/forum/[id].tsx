import { questionApi, replyApi, voteApi } from "@/apis/forum";
import { SafeArea } from "@/components/SafeArea";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionData, ReplyData } from "@/models/forum";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function QuestionDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [votingState, setVotingState] = useState<{
    isVoting: boolean;
    isLiked: boolean;
    userVoteId?: number;
    totalLikes: number;
  }>({
    isVoting: false,
    isLiked: false,
    totalLikes: 0,
  });

  const fetchQuestionDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch question details
      const questionData = await questionApi.getById(Number(id));
      setQuestion(questionData);

      // Fetch voting state
      if (user) {
        try {
          const response = await voteApi.getVoteByQuestionId(Number(id));
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

          setVotingState({
            isVoting: false,
            isLiked: userVote?.voteType === "UP",
            userVoteId: userVote?.id,
            totalLikes: totalLikes,
          });
        } catch {
          setVotingState({
            isVoting: false,
            isLiked: false,
            totalLikes: 0,
          });
        }
      }

      // Fetch replies
      try {
        const repliesData = await replyApi.getByQuestionId(Number(id));
        setReplies(repliesData);
      } catch (error) {
        console.error("Error fetching replies:", error);
        setReplies([]);
      }
    } catch (error: any) {
      console.error("Error fetching question detail:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load question",
        text2: "An unexpected error occurred.",
        position: "top",
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchQuestionDetail();
  }, [fetchQuestionDetail]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuestionDetail();
    setRefreshing(false);
  };

  const handleVote = async () => {
    if (!user || !question) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to like posts",
        position: "top",
      });
      return;
    }

    if (votingState.isVoting) return;

    // Ensure we have a valid voting state
    const safeCurrentState = votingState || {
      isVoting: false,
      isLiked: false,
      totalLikes: 0,
    };

    // Set voting state
    setVotingState((prev) => ({
      ...prev,
      isVoting: true,
    }));

    try {
      const response = await voteApi.getVoteByQuestionId(question.id);
      let votes: any[] = [];
      if (response && Array.isArray(response.data)) {
        votes = response.data;
      } else {
        votes = [];
      }
      const userVote = votes.find((vote) => vote.userId === Number(user.id));

      let newTotalLikes = votes.filter((vote) => vote.voteType === "UP").length;
      let newIsLiked: boolean;
      let newUserVoteId: number | undefined;

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
            question_id: question.id,
          });
          newTotalLikes =
            votes.filter((vote) => vote.voteType === "UP").length + 1;
          newIsLiked = true;
          newUserVoteId = newVote.data.id;
        } else {
          // Create new UP vote
          const newVote = await voteApi.createVote({
            vote_type: "UP",
            question_id: question.id,
            reply_id: undefined,
          });
          newTotalLikes += 1;
          newIsLiked = true;
          newUserVoteId = newVote.data.id;
        }
      }

      // Update voting state with new values
      setVotingState({
        isVoting: false,
        isLiked: newIsLiked,
        userVoteId: newUserVoteId,
        totalLikes: newTotalLikes,
      });

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
      setVotingState((prev) => ({
        ...safeCurrentState,
        isVoting: false,
      }));
    }
  };

  const handleSubmitReply = async () => {
    if (!user || !question || !replyText.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter a reply",
        position: "top",
      });
      return;
    }

    try {
      setSubmittingReply(true);
      // Create reply using API
      const newReply = await replyApi.create({
        content: replyText.trim(),
        author_type: "CUSTOMER",
        question_id: question.id,
      });

      setReplies((prev) => [...prev, newReply]);
      setReplyText("");

      Toast.show({
        type: "success",
        text1: "Reply Posted",
        text2: "Your reply has been added successfully",
        position: "top",
      });
    } catch (error: any) {
      console.error("Error submitting reply:", error);
      Toast.show({
        type: "error",
        text1: "Reply Failed",
        text2: error?.message || "Unable to post your reply",
        position: "top",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <SafeArea backgroundColor="#ffffff" statusBarStyle="dark-content">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f472b6" />
          <Text className="text-gray-600 mt-4">Loading question...</Text>
        </View>
      </SafeArea>
    );
  }

  if (!question) {
    return (
      <SafeArea backgroundColor="#ffffff" statusBarStyle="dark-content">
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            Question not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-pink-400 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea backgroundColor="#ffffff" statusBarStyle="dark-content">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2 rounded-full active:bg-gray-100"
            >
              <Ionicons name="arrow-back" size={24} color="#EC4899" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-lg font-bold text-pink-400">
                Question Details
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#f472b6"]}
              tintColor="#f472b6"
            />
          }
        >
          {/* Question Card */}
          <View className="bg-white border-b border-gray-100">
            <View className="flex-row p-4">
              {/* Content Section */}
              <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center mb-3">
                  <Image
                    source={{
                      uri:
                        question.customerProfile?.avatar ||
                        "https://i.pravatar.cc/150?img=1",
                    }}
                    className="w-8 h-8 rounded-full mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">
                      {question.customerProfile?.name || "Anonymous"}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatTime(question.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Title */}
                <Text className="text-xl font-bold text-pink-400 mb-3 leading-6">
                  {question.title}
                </Text>

                {/* Content */}
                <Text className="text-base text-gray-700 mb-4 leading-6">
                  {question.content}
                </Text>

                {/* Image */}
                {question.image && (
                  <View className="mb-4">
                    <Image
                      source={{ uri: question.image }}
                      className="w-full h-64 rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Stats */}
                <View className="flex-row items-center justify-between py-2 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={handleVote}
                      disabled={votingState.isVoting}
                    >
                      <Text
                        className={`text-lg ${
                          votingState.isLiked
                            ? "text-pink-400 font-bold"
                            : "text-gray-400"
                        }`}
                      >
                        {votingState.isLiked ? "❤️" : "🤍"}
                      </Text>
                    </TouchableOpacity>
                    <Text className="pl-3 text-sm font-bold text-pink-600 my-2 text-center">
                      {votingState.totalLikes}
                    </Text>
                  </View>
                  <View className="flex-row items-center mr-6">
                    <Text className="text-gray-400 text-base mr-1">💬</Text>
                    <Text className="text-sm text-gray-500 font-medium">
                      {replies.length}
                      {replies.length === 1 ? "reply" : "replies"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Replies Section */}
          <View className="bg-white">
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Replies ({replies.length})
              </Text>
            </View>

            {/* Replies List */}
            {replies.length > 0 ? (
              <View>
                {replies.map((reply) => (
                  <View key={reply.id} className="border-b border-gray-100">
                    <View className="p-4">
                      {/* Reply Header */}
                      <View className="flex-row items-center mb-2">
                        <Image
                          source={{
                            uri:
                              reply.customerProfile?.avatar ||
                              "https://i.pravatar.cc/150?img=4",
                          }}
                          className="w-6 h-6 rounded-full mr-2"
                          resizeMode="cover"
                        />
                        <Text className="text-sm font-medium text-gray-900 mr-2">
                          {reply.customerProfile?.name || "Anonymous"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {formatTime(reply.createdAt)}
                        </Text>
                      </View>

                      {/* Reply Content */}
                      <Text className="text-sm text-gray-700 leading-5 ml-8">
                        {reply.content}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="p-8 items-center">
                <Text className="text-4xl mb-2">💬</Text>
                <Text className="text-lg font-medium text-gray-800 mb-1">
                  No replies yet
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                  Be the first to share your thoughts on this question!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Reply Input */}
        {user && (
          <View className="bg-white border-t border-gray-200 px-4 py-3">
            <View className="flex-row items-end">
              <View className="flex-1 mr-3">
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Write a reply..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm max-h-24"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity
                onPress={handleSubmitReply}
                disabled={submittingReply || !replyText.trim()}
                className={`px-4 py-2 rounded-lg ${
                  submittingReply || !replyText.trim()
                    ? "bg-gray-300"
                    : "bg-pink-400"
                }`}
              >
                {submittingReply ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-semibold text-sm">Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Toast />
      </View>
    </SafeArea>
  );
}
