import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
});

export default api;

export type ResetPasswordRequestDto = {
  email: string;
  code: string;
  newPassword: string;
};

export * from './api-requests';
export * from './api-status';
