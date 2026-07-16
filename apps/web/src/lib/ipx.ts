import { env } from './env';

export function ipx(ogUrl: string, ops: string): string {
	if (env.VITE_ENABLE_IPX) {
		return `${env.VITE_IMG_PROXY_URL}/${ops}/${ogUrl}`;
	}

	return ogUrl;
}
