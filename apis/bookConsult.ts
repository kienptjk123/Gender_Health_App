import {
  allConsultantResponse,
  BookingResponse,
  ConsultantsData,
} from "@/models/BookingConsultant/bookingConsult.type";
import { apiService } from "@/utils/fetcher";

export const bookConsultApi = {
  getConsultantWorkSchedule: async (): Promise<ConsultantsData> => {
    try {
      const response = await apiService.get("/consultant-work-schedule");
      return response.data as ConsultantsData;
    } catch (error) {
      console.error("Failed to create symptom:", error);
      throw error;
    }
  },
  getAllConsultant: async (): Promise<allConsultantResponse> => {
    try {
      const response = await apiService.get("users/consultant/all");
      return response.data as allConsultantResponse;
    } catch (error) {
      console.error("Failed to create symptom:", error);
      throw error;
    }
  },
  bookSchedule: async (
    scheduleId: number,
    customerProfileId: number
  ): Promise<BookingResponse> => {
    try {
      const response = await apiService.post("/consultant-work-schedule/book", {
        scheduleId,
        customerProfileId,
      });
      return response.data as BookingResponse;
    } catch (error) {
      console.error("Failed to create symptom:", error);
      throw error;
    }
  },
};
