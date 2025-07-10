// Reset Password API Request and Response Types
export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    passwordReset: boolean;
  };
}
