export interface LoginResponse {
  userId: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
  roles: string[];
}
