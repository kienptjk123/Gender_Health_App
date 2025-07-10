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
      const token = await AsyncStorage.getItem("auth_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && refreshToken && userData) {
        setUser(JSON.parse(userData));
      } else {
        // If any token is missing, clear all auth data
        await AsyncStorage.multiRemove([
          "auth_token",
          "refresh_token",
          "user_data",
        ]);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      // Clear auth data if there's an error
      await AsyncStorage.multiRemove([
        "auth_token",
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
      console.log("Login response:", response);

      // Handle the actual API response structure
      if (response.message === "Login success" && response.result) {
        const { access_token, refresh_token, role } = response.result;

        // Create user object from available data
        const user: User = {
          id: "temp_" + Date.now().toString(), // Temporary ID
          name: credentials.email.split("@")[0], // Temporary name from email
          email: credentials.email,
          role: role || "CUSTOMER",
          date_of_birth: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await AsyncStorage.setItem("auth_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);
        await AsyncStorage.setItem("user_data", JSON.stringify(user));
        setUser(user);

        console.log("Login successful, user saved:", user);
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
      setIsLoading(true);
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([
        "auth_token",
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
