import { env } from './env';

const enableIpx = env.VITE_ENABLE_IPX;
const baseUrl = env.VITE_IMG_PROXY_URL;

export function ipx(ogUrl: string, ops: string): string {
  if (enableIpx) {
    return `${baseUrl}/${ops}/${ogUrl}`;
  }

  return ogUrl;
}
