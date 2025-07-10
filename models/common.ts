// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Generic Auth Response (can be used for both login and register)
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      phone?: string;
      dateOfBirth?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    token: string;
    refreshToken?: string;
  };
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  details?: any;
}
