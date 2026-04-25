export interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
  fcmToken?: string | null;
}
