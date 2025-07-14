import { GoogleGenerativeAI } from "@google/generative-ai";

class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey =
      process.env.EXPO_GOOGLE_GENERATIVE_AI_API_KEY ||
      "AIzaSyCLxqjPPvMLW5MxTl00S6JUPlSP1tvf3uE";
    if (!apiKey) {
      throw new Error("Google AI API key not found");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  private getConsultantPrompt(): string {
    return `You are a professional consultant specializing in Gender Health. Your role is to provide expert guidance, information, and support on topics related to:

- Women's reproductive health and menstrual cycles
- Pregnancy and prenatal care
- Menopause and hormonal changes
- Sexual health and wellness
- Gender-specific health concerns
- Contraception and family planning
- STI prevention and testing
- Mental health related to gender and reproductive issues

Guidelines for your responses:
1. Always provide accurate, evidence-based medical information
2. Be empathetic and supportive in your tone
3. Encourage users to seek professional medical care when appropriate
4. Respect privacy and maintain confidentiality
5. Be inclusive and sensitive to all gender identities
6. Provide practical advice and resources when possible
7. Always clarify that you are an AI assistant and not a replacement for professional medical care

Remember to:
- Ask clarifying questions when needed
- Provide step-by-step guidance
- Suggest when to consult healthcare providers
- Be culturally sensitive and inclusive
- Maintain professional boundaries

Please respond in a warm, professional, and helpful manner while maintaining medical accuracy.

IMPORTANT: Keep responses concise but informative. Aim for 2-3 paragraphs maximum unless more detail is specifically requested.`;
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: { text: string; isUser: boolean }[]
  ): Promise<string> {
    try {
      // Create context with previous messages for better conversation flow
      const historyText = conversationHistory
        .slice(-6) // Get last 6 messages for context
        .map((msg) => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const fullPrompt = `${this.getConsultantPrompt()}\n\nConversation History:\n${historyText}\n\nUser: ${userMessage}\n\nAssistant:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate response");
    }
  }

  getWelcomeMessage(): string {
    return "Hello! I'm your Gender Health consultant AI assistant. I'm here to help you with questions about reproductive health, menstrual cycles, sexual wellness, and other gender-related health topics. How can I assist you today?";
  }

  getErrorMessage(): string {
    return "I apologize, but I'm having trouble responding right now. Please try again in a moment. If you have urgent health concerns, please consult with a healthcare professional immediately.";
  }
}

export default new ChatbotService();
