import { apiService } from "../utils/fetcher";
import { OrderFormRequest, OrderResponse } from "../models/testPackage";

export const orderApi = {
  createOrder: async (orderData: OrderFormRequest): Promise<OrderResponse> => {
    console.log("🔄 [ORDER API] Creating order...", orderData);

    try {
      const response = await apiService.post<OrderResponse>(
        "/order/create",
        orderData
      );

      console.log("✅ [ORDER API] Order created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [ORDER API] Failed to create order:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  getOrderDetail: async (orderId: number): Promise<OrderResponse> => {
    console.log("🔄 [ORDER API] Getting order detail:", orderId);

    try {
      const response = await apiService.get<OrderResponse>(`/order/${orderId}`);

      console.log("✅ [ORDER API] Order detail retrieved:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [ORDER API] Failed to get order detail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  getAllOrders: async (): Promise<{ data: OrderResponse[] }> => {
    console.log("🔄 [ORDER API] Getting all orders...");

    try {
      const response = await apiService.get<{ data: OrderResponse[] }>(
        "/order"
      );

      console.log("✅ [ORDER API] Orders retrieved:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [ORDER API] Failed to get orders:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};
