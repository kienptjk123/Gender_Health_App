import AsyncStorage from "@react-native-async-storage/async-storage";
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

// API configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com";
export class AuthService {
  private baseURL = API_BASE_URL;
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const url = `${this.baseURL}/users/login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: data.message || "Login failed",
          error: data.error || "Authentication error",
          statusCode: response.status,
          details: data,
        };
        throw error;
      }

      // Store token if login successful
      if (data.success && data.token) {
        await AsyncStorage.setItem("auth_token", data.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("❌ Login failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const url = `${this.baseURL}/users/register`;

    try {
      console.log("📝 Registering user:", userData.email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: data.message || "Registration failed",
          error: data.error || "Registration error",
          statusCode: response.status,
          details: data,
        };
        throw error;
      }

      return data;
    } catch (error) {
      console.error("❌ Registration failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/verify-otp`;

    try {
      console.log("✅ Verifying OTP for:", data.email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: responseData.message || "OTP verification failed",
          error: responseData.error || "Verification error",
          statusCode: response.status,
          details: responseData,
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error("❌ OTP verification failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/forgot-password`;

    try {
      console.log("🔄 Requesting password reset for:", data.email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: responseData.message || "Password reset request failed",
          error: responseData.error || "Reset error",
          statusCode: response.status,
          details: responseData,
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error("❌ Password reset request failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Verify forgot password OTP
   */
  async verifyForgotPassword(
    data: VerifyForgotPasswordRequest
  ): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/verify-forgot-password`;

    try {
      console.log("✅ Verifying forgot password OTP for:", data.email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: responseData.message || "OTP verification failed",
          error: responseData.error || "Verification error",
          statusCode: response.status,
          details: responseData,
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error("❌ Forgot password OTP verification failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Reset password with new password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/reset-password`;

    try {
      console.log("🔑 Resetting password for:", data.email);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: responseData.message || "Password reset failed",
          error: responseData.error || "Reset error",
          statusCode: response.status,
          details: responseData,
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error("❌ Password reset failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Get user profile (requires authentication)
   */
  async getUserProfile(token?: string): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/profile`;

    // Get token from storage if not provided
    const authToken = token || (await AsyncStorage.getItem("auth_token"));

    if (!authToken) {
      throw new Error("No authentication token found. Please login first.");
    }

    try {
      console.log("👤 Getting user profile");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: data.message || "Failed to get user profile",
          error: data.error || "Profile error",
          statusCode: response.status,
          details: data,
        };
        throw error;
      }

      return data;
    } catch (error) {
      console.error("❌ Get user profile failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Update user profile (requires authentication)
   */
  async updateUserProfile(userData: any, token?: string): Promise<ApiResponse> {
    const url = `${this.baseURL}/users/profile`;

    // Get token from storage if not provided
    const authToken = token || (await AsyncStorage.getItem("auth_token"));

    if (!authToken) {
      throw new Error("No authentication token found. Please login first.");
    }

    try {
      console.log("📝 Updating user profile");

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          success: false,
          message: data.message || "Failed to update user profile",
          error: data.error || "Update error",
          statusCode: response.status,
          details: data,
        };
        throw error;
      }

      // Update stored user data
      if (data.success && data.user) {
        await AsyncStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("❌ Update user profile failed:", error);

      if (error instanceof TypeError && error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  /**
   * Logout user (clear local storage)
   */
  async logout(): Promise<void> {
    try {
      console.log("👋 Logging out user");

      await AsyncStorage.multiRemove(["auth_token", "user_data"]);
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      return !!token;
    } catch (error) {
      console.error("❌ Check authentication failed:", error);
      return false;
    }
  }

  /**
   * Get stored auth token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("auth_token");
    } catch (error) {
      console.error("❌ Get auth token failed:", error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("❌ Get user data failed:", error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
