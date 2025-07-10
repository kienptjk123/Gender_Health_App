// Mobile OTP Verification interfaces
export interface VerifyMobileOTPReqBody {
  otp: string;
  email: string;
}

export interface ResendMobileOTPReqBody {
  email: string;
}

export interface MobileOTPResponse {
  success: boolean;
  message: string;
  data?: any;
}
