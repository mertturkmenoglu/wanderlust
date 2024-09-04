import { cookies } from 'next/headers';
import { cache } from 'react';
import api from './api';

export type Auth = {
  data: GetMeResponseDto;
};

export type GetMeResponseDto = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  googleId: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: string;
  gender: string | null;
  profileImage: string | null;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

const cookieName = '__wanderlust_auth';

export const getAuth = cache(async (): Promise<Auth | null> => {
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

    return await res.json<Auth>();
  } catch (e) {
    return null;
  }
});
