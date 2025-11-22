export interface ResetPasswordRequest {
  phoneNumber: string;
  otpCode: string;
  password: string;
  confirmedPassword: string;
}
