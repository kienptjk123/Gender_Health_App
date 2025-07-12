// OTP Verification API Request and Response Types
export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
    token?: string;
  };
}
