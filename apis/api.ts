import {
  ApiError,
  ApiResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  OTPVerificationRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyForgotPasswordRequest,
} from "../models";

// Get API base URL from environment
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log(`Making API request to: ${url}`);
      console.log("Request config:", config);

      const response = await fetch(url, config);

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: data.message || "Request failed",
          error: data.error || "Unknown error",
          statusCode: response.status,
          details: data,
        };
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      throw error;
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log("Attempting login with:", { email: credentials.email });

    return this.makeRequest<AuthResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log("Attempting registration with:", {
      name: userData.name,
      email: userData.email,
      date_of_birth: userData.date_of_birth,
      // Don't log passwords for security
    });

    return this.makeRequest<AuthResponse>("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    console.log("Requesting password reset for:", data.email);

    return this.makeRequest<ApiResponse>("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyForgotPassword(data: VerifyForgotPasswordRequest): Promise<ApiResponse> {
    console.log("Verifying forgot password OTP for:", data.email);

    return this.makeRequest<ApiResponse>("/users/verify-forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse> {
    console.log("Verifying OTP for:", data.email);

    return this.makeRequest<ApiResponse>("/users/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    console.log("Resetting password for:", data.email);

    return this.makeRequest<ApiResponse>("/users/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Authenticated requests (with token)
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(token: string): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/users/profile", token);
  }

  async updateUserProfile(token: string, userData: any): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/users/profile", token, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Health data APIs (for future implementation)
  async getPeriodData(token: string): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/health/periods", token);
  }

  async savePeriodData(token: string, periodData: any): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/health/periods", token, {
      method: "POST",
      body: JSON.stringify(periodData),
    });
  }

  async getMoodData(token: string): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/health/mood", token);
  }

  async saveMoodData(token: string, moodData: any): Promise<ApiResponse> {
    return this.makeAuthenticatedRequest("/health/mood", token, {
      method: "POST",
      body: JSON.stringify(moodData),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
