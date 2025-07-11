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
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    role: string;
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
