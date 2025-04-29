export const imgProxyBaseUrl = import.meta.env.VITE_IMG_PROXY_URL ?? "";

export function ipx(ogUrl: string, ops: string): string {
  return `${imgProxyBaseUrl}/${ops}/${ogUrl}`;
}
