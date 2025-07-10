import { apiService } from "../utils/fetcher";
import { PaymentRequest, PaymentResponse } from "../models/testPackage";

export const paymentApi = {
  createPayment: async (
    paymentData: PaymentRequest
  ): Promise<PaymentResponse> => {
    console.log("🔄 [PAYMENT API] Creating payment...", paymentData);

    try {
      const response = await apiService.post<PaymentResponse>(
        "/payment/vnpay/create",
        paymentData
      );

      console.log(
        "✅ [PAYMENT API] Payment created successfully:",
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ [PAYMENT API] Failed to create payment:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  getPaymentStatus: async (paymentId: number): Promise<PaymentResponse> => {
    console.log("🔄 [PAYMENT API] Getting payment status:", paymentId);

    try {
      const response = await apiService.get<PaymentResponse>(
        `/payments/${paymentId}`
      );

      console.log("✅ [PAYMENT API] Payment status retrieved:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [PAYMENT API] Failed to get payment status:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  verifyPayment: async (
    transactionId: string
  ): Promise<{ success: boolean; message: string }> => {
    console.log("🔄 [PAYMENT API] Verifying payment:", transactionId);

    try {
      const response = await apiService.post<{
        success: boolean;
        message: string;
      }>("/payments/verify", { transactionId });

      console.log("✅ [PAYMENT API] Payment verified:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [PAYMENT API] Failed to verify payment:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};
