import { ResultOfTestResponse } from "@/models/STI/result.type";
import { StiTrackingResponse } from "@/models/STI/sti.type";
import { apiService } from "@/utils/fetcher";
import { AxiosError, AxiosResponse } from "axios";

export const stiApi = {
  // Lấy danh sách theo dõi STI
  getStiByCustomerProfileId: async (
    customerProfileId: number
  ): Promise<StiTrackingResponse> => {
    try {
      const response: AxiosResponse<StiTrackingResponse> = await apiService.get(
        `/stis-tracking/customer/${customerProfileId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
  getTestResultByStiTrackingId: async (
    id: number
  ): Promise<ResultOfTestResponse> => {
    try {
      const response: AxiosResponse<any> = await apiService.get(
        `/result-of-test/${id}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
};
