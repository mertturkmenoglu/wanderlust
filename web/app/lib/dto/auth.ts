export type AuthDto = {
  data: GetMeResponseDto;
};

export type GetMeResponseDto = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  googleId: string | null;
  facebookId: string | null;
  isEmailVerified: boolean;
  isOnboardingCompleted: boolean;
  isActive: boolean;
  role: string;
  profileImage: string | null;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

export type ResetPasswordRequestDto = {
  email: string;
  code: string;
  newPassword: string;
};
