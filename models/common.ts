// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
  result?: T;
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

// User Profile API Response
export interface UserProfileResponse {
  message: string;
  result: {
    id: number;
    email: string;
    role: string;
    status: string;
    customer_profile_id: number;
    created_at: string;
    updated_at: string;
    name: string;
    bio?: string;
    location?: string;
    username: string;
    avatar?: string;
    coverPhoto?: string;
    date_of_birth?: string;
    website?: string;
    phone_number?: string;
    description?: string;
  };
}
