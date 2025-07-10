import { apiService } from "../utils/fetcher";
import type {
  QuestionData,
  QuestionRequest,
  ReplyData,
  ReplyRequest,
  VoteData,
  VoteRequest,
} from "../models/forum";

export const questionApi = {
  getAll: async (): Promise<QuestionData[]> => {
    const response = await apiService.get("/questions");
    return response.data as QuestionData[];
  },

  getById: async (id: number): Promise<QuestionData> => {
    const response = await apiService.get(`/questions/${id}`);
    return response.data as QuestionData;
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
    return response.data as QuestionData;
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
    return response.data as QuestionData;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete(`/questions/delete/${id}`);
  },

  search: async (query: string): Promise<QuestionData[]> => {
    const response = await apiService.get("/questions/search", {
      params: { q: query },
    });
    return response.data as QuestionData[];
  },
};

export const replyApi = {
  getByQuestionId: async (questionId: number): Promise<ReplyData[]> => {
    const response = await apiService.get(`/replies/question/${questionId}`);
    return response.data as ReplyData[];
  },

  create: async (payload: ReplyRequest): Promise<ReplyData> => {
    const response = await apiService.post("/replies", payload);
    return response.data as ReplyData;
  },

  update: async (
    id: number,
    payload: { content: string }
  ): Promise<ReplyData> => {
    const response = await apiService.put(`/replies/${id}`, payload);
    return response.data as ReplyData;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete(`/replies/${id}`);
  },
};

export const voteApi = {
  getByQuestionId: async (questionId: number): Promise<VoteData[]> => {
    const response = await apiService.get(`/votes/question/${questionId}`);
    return response.data as VoteData[];
  },

  create: async (payload: VoteRequest): Promise<VoteData> => {
    const response = await apiService.post("/votes", payload);
    return response.data as VoteData;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete(`/votes/${id}`);
  },
};
