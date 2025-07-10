import { apiService } from "../utils/fetcher";
import {
  TestPackageResponse,
  TypeOfTestResponse,
  TestPackageItemResponse,
} from "../models/testPackage";

export const testPackageApi = {
  getAllTestPackages: async (): Promise<TestPackageResponse> => {
    console.log("🔄 [API] Starting getAllTestPackages request...");

    try {
      console.log("🔄 [API] Calling apiService.get('/test-package')...");
      const response = await apiService.get<TestPackageResponse>(
        "/test-package"
      );

      console.log("✅ [API] Response received:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [API] Failed to fetch test packages:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  },

  // Get all type of tests
  getTypeOfTests: async (): Promise<TypeOfTestResponse> => {
    console.log("🔄 [API] Starting getTypeOfTests request...");

    try {
      console.log("🔄 [API] Calling apiService.get('/type-of-test')...");
      const response = await apiService.get<TypeOfTestResponse>(
        "/type-of-test"
      );

      console.log("✅ [API] Type of tests response received:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ [API] Failed to fetch type of tests:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  },
  testDirectCall: async (): Promise<any> => {
    const baseUrl =
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/test-package`;

    console.log("🔧 [TEST] Direct API call to:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("🔧 [TEST] Response status:", response.status);
      console.log(
        "🔧 [TEST] Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const textResponse = await response.text();
      console.log("🔧 [TEST] Raw response:", textResponse);

      if (response.ok) {
        try {
          const jsonData = JSON.parse(textResponse);
          console.log("🔧 [TEST] Parsed JSON:", jsonData);
          return jsonData;
        } catch (parseError) {
          console.error("🔧 [TEST] JSON parse error:", parseError);
          return { error: "Invalid JSON", rawResponse: textResponse };
        }
      } else {
        return { error: `HTTP ${response.status}`, rawResponse: textResponse };
      }
    } catch (error: any) {
      console.error("🔧 [TEST] Network error:", error);
      return { error: error.message };
    }
  },

  getTestPackageDetail: async (
    id: number
  ): Promise<TestPackageItemResponse> => {
    try {
      const response = await apiService.get<TestPackageItemResponse>(
        `/test-package/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch test package detail:", error);
      throw error;
    }
  },
};
