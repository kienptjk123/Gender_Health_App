import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import chatbotService from "../../apis/chatbot";
import {
  ChatHeader,
  QuickReplies,
  TypingIndicator,
} from "../../components/ChatbotComponents";
import { Message, useChatbot } from "../../contexts/ChatbotContext";

const QUICK_REPLIES = [
  "Tell me about menstrual cycles",
  "Pregnancy questions",
  "STI prevention",
  "Contraception options",
  "Menopause symptoms",
  "Mental health support",
];

export default function ChatbotScreen() {
  const { state, addMessage, setLoading, clearChat } = useChatbot();
  const [inputText, setInputText] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputText("");
    setLoading(true);
    setShowQuickReplies(false);

    try {
      const response = await chatbotService.generateResponse(
        userMessage.text,
        state.messages
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: chatbotService.getErrorMessage(),
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPress = () => {
    sendMessage();
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleClearChat = () => {
    clearChat();
    setShowQuickReplies(true);
  };

  const handleBack = () => {
    router.back();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-4 ${
        item.isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!item.isUser && (
        <View className="w-8 h-8 rounded-full bg-pink-100 items-center justify-center mr-2 mt-1">
          <Ionicons name="medical" size={16} color="#ec4899" />
        </View>
      )}
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          item.isUser
            ? "bg-pink-500 rounded-br-sm"
            : "bg-gray-100 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-sm leading-5 ${
            item.isUser ? "text-white" : "text-gray-800"
          }`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.isUser ? "text-pink-100" : "text-gray-500"
          }`}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      {item.isUser && (
        <View className="w-8 h-8 rounded-full bg-pink-500 items-center justify-center ml-2 mt-1">
          <Ionicons name="person" size={16} color="white" />
        </View>
      )}
    </View>
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ChatHeader onClearChat={handleClearChat} onBack={handleBack} />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={state.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Quick Replies */}
      {showQuickReplies && state.messages.length === 1 && (
        <QuickReplies replies={QUICK_REPLIES} onReplyPress={handleQuickReply} />
      )}

      {/* Loading indicator */}
      {state.isLoading && <TypingIndicator />}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="px-4 py-3 border-t border-gray-200 bg-white">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 min-h-14 max-h-14 bg-gray-100 rounded-2xl px-2 mr-2 py-2 justify-center">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about your health concerns..."
                placeholderTextColor="#9ca3af"
                multiline
                className="text-base text-gray-800 max-h-[96px]"
                style={{ textAlignVertical: "center" }}
              />
            </View>
            <TouchableOpacity
              onPress={handleSendPress}
              disabled={!inputText.trim() || state.isLoading}
              className={`w-14 h-14 rounded-full items-center justify-center ${
                inputText.trim() && !state.isLoading
                  ? "bg-pink-500"
                  : "bg-gray-300"
              }`}
            >
              <Ionicons
                name="send"
                size={18}
                color={
                  inputText.trim() && !state.isLoading ? "white" : "#9ca3af"
                }
              />
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <Text className="text-xs text-gray-500 mt-2 text-center">
            This AI assistant provides general information only. For medical
            emergencies or serious concerns, consult a healthcare professional.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
