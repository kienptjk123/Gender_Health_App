import {
  CreateFertilityData,
  CreateMedicationData,
  CreateMenstrualCycleData,
  CreateMoodData,
  CreateSymptomData,
  DailySymptomResponse,
  MenstrualCycleResponse,
  Prediction,
} from "@/models/menstrualModels";
import { apiService } from "@/utils/fetcher";
import { AxiosResponse } from "axios";
export const menstrualApi = {
  createMenstrualCycle: async (
    data: CreateMenstrualCycleData
  ): Promise<MenstrualCycleResponse> => {
    try {
      const response: AxiosResponse<MenstrualCycleResponse> =
        await apiService.post("/menstrual-cycles/create", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create menstrual cycle:", error);
      throw error;
    }
  },

  createSymptom: async (
    data: CreateSymptomData
  ): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> =
        await apiService.post("/daily-symptoms/create", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create symptom:", error);
      throw error;
    }
  },

  createFertility: async (
    data: CreateFertilityData
  ): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> =
        await apiService.post("/fertility-tracking/create", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create fertility data:", error);
      throw error;
    }
  },

  createMedication: async (
    data: CreateMedicationData
  ): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> =
        await apiService.post("/medication-tracking/create", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create medication:", error);
      throw error;
    }
  },

  createMood: async (data: CreateMoodData): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> =
        await apiService.post("/mood-tracking/create", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create mood data:", error);
      throw error;
    }
  },
  getPrediction: async (customerProfileId: number): Promise<Prediction> => {
    const response: AxiosResponse<Prediction> = await apiService.get(
      `/prediction/${customerProfileId}`
    );
    return response.data;
  },
};
