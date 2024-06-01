import { cookies } from 'next/headers';

export function getAuthHeader() {
  const token = cookies().get('__session')?.value;

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
