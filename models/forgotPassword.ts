// Forgot Password API Request and Response Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyForgotPasswordRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    otpSent: boolean;
    expiresIn?: number;
  };
}

export interface VerifyForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
    resetToken?: string;
  };
}
