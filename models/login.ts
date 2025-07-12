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

// User model for login response - Updated to match API structure
export interface User {
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
}
