import { apiService } from "../utils/fetcher";
import type {
  BlogPost,
  BlogResponse,
  BlogSingleResponse,
} from "../models/blog";

export const blogApi = {
  getAll: async (page: number = 1, limit: number = 10): Promise<BlogPost[]> => {
    const response = await apiService.get("/blogs", {
      params: { page, limit },
    });
    const responseData = response.data as BlogResponse;
    return responseData.data;
  },

  getById: async (id: string | number): Promise<BlogPost> => {
    const response = await apiService.get(`/blogs/${id}`);
    const responseData = response.data as BlogSingleResponse;
    return responseData.data;
  },
};
