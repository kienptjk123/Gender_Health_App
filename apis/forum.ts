import type {
  QuestionData,
  QuestionRequest,
  ReplyData,
  ReplyRequest,
  VoteRequest,
  VoteResponse,
  VoteResponseCreate,
} from "../models/forum";
import { apiService } from "../utils/fetcher";

export const questionApi = {
  getAll: async (): Promise<QuestionData[]> => {
    const response = await apiService.get("/questions");
    // The API returns { message: "success", data: [...] }
    return (response.data as any).data as QuestionData[];
  },

  getById: async (id: number): Promise<QuestionData> => {
    const response = await apiService.get(`/questions/${id}`);
    return (response.data as any).data as QuestionData;
  },

  create: async (
    payload: QuestionRequest | FormData
  ): Promise<QuestionData> => {
    const config =
      payload instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    const response = await apiService.post(
      "/questions/create",
      payload,
      config
    );
    return (response.data as any).data as QuestionData;
  },

  update: async (
    id: number,
    payload: QuestionRequest | FormData
  ): Promise<QuestionData> => {
    const config =
      payload instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    const response = await apiService.put(
      `/questions/update/${id}`,
      payload,
      config
    );
    return (response.data as any).data as QuestionData;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete(`/questions/delete/${id}`);
  },

  search: async (query: string): Promise<QuestionData[]> => {
    const response = await apiService.get("/questions/search", {
      params: { q: query },
    });
    return (response.data as any).data as QuestionData[];
  },
};

export const replyApi = {
  getByQuestionId: async (questionId: number): Promise<ReplyData[]> => {
    const response = await apiService.get(`/replies/question/${questionId}`);
    return (response.data as any).data as ReplyData[];
  },

  create: async (payload: ReplyRequest): Promise<ReplyData> => {
    const response = await apiService.post("/replies/create", payload);
    return (response.data as any).data as ReplyData;
  },

  getById: async (replyId: number): Promise<ReplyData> => {
    const response = await apiService.get(`/replies/${replyId}`);
    return (response.data as any).data as ReplyData;
  },

  update: async (
    id: number,
    payload: { content: string }
  ): Promise<ReplyData> => {
    const response = await apiService.put(`/replies/update/${id}`, payload);
    return (response.data as any).data as ReplyData;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete(`/replies/delete/${id}`);
  },
};

export const voteApi = {
  createVote: async (data: VoteRequest): Promise<VoteResponseCreate> => {
    try {
      const response = await apiService.post("/votes/create", data);
      return response.data as VoteResponseCreate;
    } catch (error) {
      console.error("Failed to create reply:", error);
      throw error;
    }
  },
  getVoteByQuestionId: async (questionId: number): Promise<VoteResponse> => {
    try {
      const response = await apiService.get(`/votes/question/${questionId}`);
      return response.data as VoteResponse;
    } catch (error) {
      console.error("Failed to fetch reply by ID:", error);
      throw error;
    }
  },
  getVoteByReplyId: async (replyId: number): Promise<VoteResponse> => {
    try {
      const response = await apiService.get(`/votes/reply/${replyId}`);
      return response.data as VoteResponse;
    } catch (error) {
      console.error("Failed to fetch reply by ID:", error);
      throw error;
    }
  },

  deleteVote: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiService.delete(`/votes/delete/${id}`);
      return response.data as { message: string };
    } catch (error) {
      console.error("Failed to delete reply:", error);
      throw error;
    }
  },
};
