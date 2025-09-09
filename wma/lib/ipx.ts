// const baseUrl = env.VITE_IMG_PROXY_URL;
const enableIpx = true;
// const baseUrl = "http://192.168.0.15:3002";
const baseUrl = "http://192.168.0.15:3002";

export function ipx(ogUrl: string, ops: string): string {
  if (enableIpx) {
    return `${baseUrl}/${ops}/${ogUrl}`;
  }

  return ogUrl;
}
