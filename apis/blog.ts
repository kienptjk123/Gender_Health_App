import { apiService } from "../utils/fetcher";
import type { BlogPost, BlogResponse } from "../models/blog";

export const blogApi = {
  getAll: async (page: number = 1, limit: number = 10): Promise<BlogPost[]> => {
    const response = await apiService.get("/blogs", {
      params: { page, limit },
    });
    return (response.data as BlogResponse).data;
  },

  getById: async (id: string | number): Promise<BlogPost> => {
    const response = await apiService.get(`/blogs/${id}`);
    return response.data as BlogPost;
  },
};
