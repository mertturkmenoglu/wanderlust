import { styleText } from 'node:util';

export function logger(request: Request, response: Response, duration: number) {
	const url = new URL(request.url);

	if (url.pathname === '/api/v3/inngest') {
		return;
	}

	const method = styleText('bgGreen', `[${request.method}]`.padEnd(8));
	const pathname = styleText('cyan', url.pathname.padEnd(20));
	const status = styleText('red', `${response.status}`);

	console.log(`${method} ${pathname} - ${status} (${duration}ms)`);
}
