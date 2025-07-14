# Gender Health App - Chatbot Feature

## Overview

The Gender Health App now includes an AI-powered chatbot that serves as a professional consultant specializing in gender health topics. The chatbot uses Google's Gemini AI to provide expert guidance and support.

## Features

### 🤖 AI-Powered Consultation

- **Professional Gender Health Consultant**: The chatbot is designed to act as a professional consultant specializing in gender health
- **Gemini AI Integration**: Uses Google's Gemini Pro model for intelligent responses
- **Contextual Conversations**: Maintains conversation history for better context understanding

### 🩺 Health Topics Covered

- Women's reproductive health and menstrual cycles
- Pregnancy and prenatal care
- Menopause and hormonal changes
- Sexual health and wellness
- Gender-specific health concerns
- Contraception and family planning
- STI prevention and testing
- Mental health related to gender and reproductive issues

### 💬 Chat Interface Features

- **Clean, Modern UI**: Designed with a pink color scheme matching the app's health theme
- **Real-time Messaging**: Instant message sending and receiving
- **Quick Replies**: Pre-defined questions for common topics
- **Typing Indicators**: Shows when the AI is generating a response
- **Message Timestamps**: Displays when each message was sent
- **Clear Chat Option**: Ability to start fresh conversations
- **Keyboard Optimization**: Proper keyboard handling for better UX

### 🔒 Safety Features

- **Medical Disclaimers**: Clear warnings that the AI is not a replacement for professional medical care
- **Emergency Guidance**: Encourages users to seek professional help for urgent concerns
- **Ethical Guidelines**: AI follows professional medical ethics and best practices

## Technical Implementation

### Architecture

```
/apis/chatbot.ts           - Gemini AI service integration
/app/(tabs)/chatbot.tsx    - Main chatbot screen
/contexts/ChatbotContext.tsx - State management for conversations
/components/ChatbotComponents.tsx - Reusable UI components
```

### Dependencies

- `@google/generative-ai` - Google Gemini AI integration
- React Context for state management
- Expo Router for navigation
- NativeWind for styling

### Environment Variables

Make sure to set your Google AI API key in `.env`:

```
EXPO_GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## Usage

1. **Access**: Navigate to the "Chatbot" tab in the bottom navigation
2. **Start Conversation**: Use quick replies or type your own question
3. **Get Guidance**: Receive professional advice on gender health topics
4. **Continue Conversation**: The AI remembers context from previous messages
5. **Clear Chat**: Use the trash icon to start a new conversation

## Best Practices

### For Users

- Be specific about your health concerns
- Provide relevant context when asking questions
- Always follow up with healthcare professionals for serious concerns
- Use the quick replies for common topics

### For Developers

- The AI responses are contextual, so conversation history is important
- Error handling is built-in for network issues
- The service class can be easily extended for additional functionality
- UI components are reusable and customizable

## Safety and Ethics

- The chatbot clearly identifies itself as an AI assistant
- Always recommends professional medical care when appropriate
- Maintains user privacy and confidentiality
- Provides evidence-based information
- Is inclusive and sensitive to all gender identities

## Future Enhancements

Potential improvements for the chatbot:

- Message persistence (save chat history)
- Voice input/output capabilities
- Multi-language support
- Integration with appointment booking
- Personalized recommendations based on user profile
- Rich media responses (images, charts)
- Export conversation summaries

## Navigation Integration

The chatbot is fully integrated into the app's bottom tab navigation:

- Positioned between "Cycle" and "Blog" tabs
- Uses a chat bubble icon for easy identification
- Maintains state across navigation
- Works seamlessly with the app's authentication and routing

The chatbot provides a valuable addition to the Gender Health App, offering users immediate access to professional health guidance while maintaining the highest standards of medical ethics and user safety.
