import { authService } from "@/apis/auth";
import {
  LoginRequest,
  RegisterRequest,
  User,
  VerifyForgotPasswordRequest,
} from "@/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  verifyForgotPassword: (data: VerifyForgotPasswordRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && refreshToken && userData) {
        setUser(JSON.parse(userData));
      } else {
        // If any token is missing, clear all auth data
        await AsyncStorage.multiRemove([
          "access_token",
          "refresh_token",
          "user_data",
        ]);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      // Clear auth data if there's an error
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_data",
      ]);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("Attempting login with credentials:", credentials);

      const response = await authService.login(credentials);

      if (response.message === "Login success" && response.result) {
        const { access_token, refresh_token, role } = response.result;

        // Store tokens first
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);

        try {
          // Fetch complete user profile using the access token
          console.log("Fetching user profile...");
          const profileResponse = await authService.getMyProfile();

          if (
            profileResponse.message === "Get my profile success" &&
            profileResponse.result
          ) {
            const userProfile = profileResponse.result;

            // Create complete user object from API response
            const user: User = {
              id: userProfile.id,
              email: userProfile.email,
              role: userProfile.role,
              status: userProfile.status,
              customer_profile_id: userProfile.customer_profile_id,
              created_at: userProfile.created_at,
              updated_at: userProfile.updated_at,
              name: userProfile.name,
              bio: userProfile.bio,
              location: userProfile.location,
              username: userProfile.username,
              avatar: userProfile.avatar,
              coverPhoto: userProfile.coverPhoto,
              date_of_birth: userProfile.date_of_birth,
              website: userProfile.website,
              phone_number: userProfile.phone_number,
              description: userProfile.description,
            };

            await AsyncStorage.setItem("user_data", JSON.stringify(user));
            setUser(user);
            console.log("Login successful, complete user profile saved:", user);
          } else {
            throw new Error("Failed to fetch user profile");
          }
        } catch (profileError) {
          console.log(profileError);
        }
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      console.log("Attempting registration with data:", userData);

      const response = await authService.register(userData);
      console.log("Registration response:", response);

      // Check for success based on the actual API response format
      if (
        response.message ===
          "Mobile register success. Please check your email for OTP verification." ||
        response.message === "Registration successful" ||
        response.message === "User registered successfully" ||
        response.message?.includes("register success") ||
        response.message?.includes(
          "Please check your email for OTP verification"
        )
      ) {
        console.log("Registration successful! User can now verify OTP.");
        return;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const verifyForgotPassword = async (
    data: VerifyForgotPasswordRequest
  ): Promise<void> => {
    try {
      // DO NOT set loading state as it might trigger AuthGuard re-render
      console.log("Verifying forgot password OTP:", data);

      const response = await authService.verifyForgotPassword(data);
      console.log("Verify forgot password response:", response);

      if (
        response.success ||
        response.message === "OTP verified successfully"
      ) {
        console.log("Forgot password OTP verification successful!");
        return;
      } else {
        throw new Error(response.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error during forgot password verification:", error);
      console.error(
        "=== AuthContext: verifyForgotPassword error - ABSOLUTELY NO NAVIGATION ==="
      );

      // CRITICAL: Just throw the error, NEVER trigger any navigation
      // NEVER call setIsLoading or any state changes that might trigger AuthGuard
      // The OTP verification page will handle the error and UI completely
      throw error;
    }
    // Removed finally block to avoid any state changes
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_data",
      ]);

      // Clear user state
      setUser(null);

      router.replace("/auth/login");

      console.log("Logout successful - tokens cleared and redirected to login");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthState,
    verifyForgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
