export const imgProxyBaseUrl = import.meta.env.VITE_IMG_PROXY_URL ?? '';

const enableIpx = import.meta.env.VITE_ENABLE_IPX ?? false;

export function ipx(ogUrl: string, ops: string): string {
  if (!enableIpx) {
    return ogUrl;
  } else {
    return `${imgProxyBaseUrl}/${ops}/${ogUrl}`;
  }
}
