// Login API Request and Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}

// User model for login response
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
  date_of_birth?: string; // ISO 8601 format
  created_at?: string;
  updated_at?: string;
}
