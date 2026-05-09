export interface MyProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  address?: string | null;
  createdAt: string;
}

export interface UpdateMyProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profilePictureUrl: string | null;
}
