export function withCors(response: Response): Response {
	response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	response.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	);
	response.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization',
	);
	response.headers.set('Access-Control-Allow-Credentials', 'true');

	return response;
}
