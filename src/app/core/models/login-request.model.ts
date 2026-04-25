export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string | null;
}
