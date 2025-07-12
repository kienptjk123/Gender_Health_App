import { User } from './login';

// Register API Request and Response Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string; // ISO 8601 format: "2020-03-28T10:15:01Z"
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}
