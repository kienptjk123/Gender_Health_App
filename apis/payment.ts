import type { AxiosError, AxiosResponse } from "axios";
import { apiService } from "../utils/fetcher";
import { PaymentRequest, PaymentResponse } from "../models/testPackage";

export const paymentApi = {
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response: AxiosResponse<PaymentResponse> = await apiService.post(
        `/payment/vnpay/create`,
        data
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },

  getAllPayments: async (): Promise<{ data: PaymentResponse[] }> => {
    try {
      const response: AxiosResponse<{ data: PaymentResponse[] }> =
        await apiService.get(`/payment`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
};
