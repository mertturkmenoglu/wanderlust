import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import api from './api';

export type AuthDto = {
  data: GetMeResponseDto;
};

export type GetMeResponseDto = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  googleId: string | null;
  isEmailVerified: boolean;
  isOnboardingCompleted: boolean;
  isActive: boolean;
  role: string;
  gender: string | null;
  profileImage: string | null;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

const cookieName = '__wanderlust_auth';

export const getAuth = cache(async (): Promise<AuthDto | null> => {
  const sessionCookie = cookies().get(cookieName);

  if (!sessionCookie) {
    return null;
  }

  try {
    const res = await api.get('auth/me', {
      credentials: 'include',
      headers: {
        Cookie: `${cookieName}=${sessionCookie.value}`,
      },
    });

    if (res.status !== 200) {
      return null;
    }

    return await res.json<AuthDto>();
  } catch (e) {
    return null;
  }
});

export function protect(auth: AuthDto | null) {
  if (auth === null) {
    redirect('/sign-in');
  }

  protectOnboard(auth);
}

export function protectOnboard(auth: AuthDto | null) {
  if (auth === null) {
    return;
  }

  if (!auth.data.isOnboardingCompleted) {
    redirect('/onboarding');
  }

  if (!auth.data.isEmailVerified) {
    redirect('/verify-email');
  }
}