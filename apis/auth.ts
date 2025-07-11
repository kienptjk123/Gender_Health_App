import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ApiResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MobileOTPResponse,
  OTPVerificationRequest,
  RegisterRequest,
  ResendMobileOTPReqBody,
  ResetPasswordRequest,
  VerifyForgotPasswordRequest,
  VerifyMobileOTPReqBody,
} from "../models";
import { apiService } from "../utils/fetcher";

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log("🔐 Attempting login for:", credentials.email);

      const response = await apiService.post<AuthResponse>(
        "/users/login",
        credentials
      );

      console.log("✅ Login successful:", response.data);

      // Store tokens if available
      if (response.data.result?.access_token) {
        await AsyncStorage.setItem(
          "access_token",
          response.data.result.access_token
        );
        await AsyncStorage.setItem(
          "refresh_token",
          response.data.result.refresh_token
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Login failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log("📝 Registering user:", userData.email);

      const response = await apiService.post<any>(
        "/users/mobile/register",
        userData
      );

      console.log("✅ Registration successful:", response.data);

      return {
        message: response.data.message || "Registration successful",
        result: {
          access_token: response.data.data?.access_token || "",
          refresh_token: response.data.data?.refresh_token || "",
          role: "user",
        },
      };
    } catch (error: any) {
      console.error("❌ Registration failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse> {
    try {
      console.log("✅ Verifying OTP for:", data.email);

      const response = await apiService.post<ApiResponse>(
        "/users/verify-otp",
        data
      );

      console.log("✅ OTP verification successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ OTP verification failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      console.log("🔄 Requesting password reset for:", data.email);

      const response = await apiService.post<ApiResponse>(
        "/users/forgot-password",
        data
      );

      console.log("✅ Password reset request successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Password reset request failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async verifyForgotPassword(
    data: VerifyForgotPasswordRequest
  ): Promise<ApiResponse> {
    try {
      console.log("✅ Verifying forgot password OTP for:", data.email);
      console.log("🔢 OTP being sent:", data.otp);
      console.log("📝 Full request data:", JSON.stringify(data));

      const response = await apiService.post<ApiResponse>(
        "/users/verify-forgot-password",
        data
      );

      console.log(
        "✅ Forgot password OTP verification successful:",
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ Forgot password OTP verification failed:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error message:", error.message);

      if (error.response?.data) {
        throw error.response.data;
      }

      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      console.log("🔑 Resetting password with OTP");

      const response = await apiService.post<ApiResponse>(
        "/users/reset-password",
        data
      );

      console.log("✅ Password reset successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Password reset failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      throw error;
    }
  }

  async getUserProfile(token?: string): Promise<ApiResponse> {
    try {
      console.log("👤 Getting user profile");

      const response = await apiService.get<ApiResponse>("/users/me");
      return response.data;
    } catch (error: any) {
      console.error("❌ Get user profile failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async updateUserProfile(userData: any, token?: string): Promise<ApiResponse> {
    try {
      console.log("📝 Updating user profile");

      const response = await apiService.put<ApiResponse>(
        "/users/profile",
        userData
      );

      console.log("✅ User profile updated successfully:", response.data);

      // Update local storage if successful
      if (response.data.success && response.data.data) {
        await AsyncStorage.setItem(
          "user_data",
          JSON.stringify(response.data.data)
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("❌ Update user profile failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("👋 Logging out user");

      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_data",
      ]);
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("access_token");
      return !!token;
    } catch (error) {
      console.error("❌ Check authentication failed:", error);
      return false;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("access_token");
    } catch (error) {
      console.error("❌ Get auth token failed:", error);
      return null;
    }
  }

  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("❌ Get user data failed:", error);
      return null;
    }
  }

  async verifyMobileOTP(
    data: VerifyMobileOTPReqBody
  ): Promise<MobileOTPResponse> {
    try {
      console.log("✅ Verifying mobile OTP for:", data.email);

      const response = await apiService.post<MobileOTPResponse>(
        "/users/mobile/verify-otp",
        data
      );

      console.log("✅ Mobile OTP verification successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Mobile OTP verification failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }

  async resendMobileOTP(
    data: ResendMobileOTPReqBody
  ): Promise<MobileOTPResponse> {
    try {
      console.log("📤 Resending mobile OTP to:", data.email);

      const response = await apiService.post<MobileOTPResponse>(
        "/users/mobile/resend-otp",
        data
      );

      console.log("✅ Mobile OTP resent successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Resend mobile OTP failed:", error);

      if (error.response?.data) {
        throw error.response.data;
      }

      if (error.message?.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
