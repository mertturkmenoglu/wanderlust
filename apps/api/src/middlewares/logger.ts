import { styleText } from 'node:util';

export function logger(request: Request, response: Response, duration: number) {
	const url = new URL(request.url);

	if (url.pathname === '/api/v3/inngest') {
		return;
	}

	const method = getStyledMethod(request.method);
	const pathname = styleText('white', url.pathname.padEnd(40));
	const status = getStyledStatus(response.status);

	console.log(`(${status}) ${method} ${pathname} (${duration}ms)`);
}

function getStyledMethod(method: string): string {
	switch (method) {
		case 'GET':
			return styleText('green', `[${method}]`.padEnd(9));
		case 'POST':
			return styleText('blue', `[${method}]`.padEnd(9));
		case 'PUT':
			return styleText('cyan', `[${method}]`.padEnd(9));
		case 'PATCH':
			return styleText('cyan', `[${method}]`.padEnd(9));
		case 'DELETE':
			return styleText('red', `[${method}]`.padEnd(9));
		default:
			return styleText('gray', `[${method}]`.padEnd(9));
	}
}

function getStyledStatus(status: number): string {
	if (status >= 200 && status < 300) {
		return styleText('green', `${status}`);
	}

	if (status >= 300 && status < 400) {
		return styleText('blue', `${status}`);
	}

	if (status >= 400 && status < 500) {
		return styleText('yellow', `${status}`);
	}

	return styleText('red', `${status}`);
}
