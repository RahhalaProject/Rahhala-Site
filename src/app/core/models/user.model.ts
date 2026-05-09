export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  phoneNumber?: string | null;
  profilePictureUrl?: string | null;
  address?: string | null;
}
