import { createContext, ReactNode, useContext, useReducer } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type ChatbotAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_CHAT" };

const initialState: ChatbotState = {
  messages: [
    {
      id: "1",
      text: "Hello! I'm your Gender Health consultant AI assistant. I'm here to help you with questions about reproductive health, menstrual cycles, sexual wellness, and other gender-related health topics. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  error: null,
};

function chatbotReducer(
  state: ChatbotState,
  action: ChatbotAction
): ChatbotState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_CHAT":
      return {
        ...initialState,
        messages: [initialState.messages[0]], // Keep welcome message
      };
    default:
      return state;
  }
}

interface ChatbotContextType {
  state: ChatbotState;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  const addMessage = (message: Message) => {
    dispatch({ type: "ADD_MESSAGE", payload: message });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const clearChat = () => {
    dispatch({ type: "CLEAR_CHAT" });
  };

  return (
    <ChatbotContext.Provider
      value={{
        state,
        addMessage,
        setLoading,
        setError,
        clearChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}

export type { Message };
