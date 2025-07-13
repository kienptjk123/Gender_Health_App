import { OrderFormRequest, OrderResponse } from "../models/testPackage";
import type { AxiosError, AxiosResponse } from "axios";
import { apiService } from "../utils/fetcher";

export const orderApi = {
  createOrder: async (data: OrderFormRequest): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<OrderResponse> = await apiService.post(
        `/order/create`,
        data
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  getDetailOrder: async (id: number): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<OrderResponse> = await apiService.get(
        `/order/${id}`
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  getAllOrders: async (): Promise<{ data: OrderResponse[] }> => {
    try {
      const response: AxiosResponse<{ data: OrderResponse[] }> =
        await apiService.get(`/order`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
};
