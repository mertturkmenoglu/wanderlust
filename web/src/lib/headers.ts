import { cookies } from 'next/headers';

const cookieName = '__wanderlust_auth';

export function getAuthCookie() {
  const v = cookies().get(cookieName)?.value ?? '';
  return {
    Cookie: `${cookieName}=${v}`,
  };
}
