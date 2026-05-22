import {
	createIPX,
	createIPXWebServer,
	ipxFSStorage,
	ipxHttpStorage,
} from 'ipx';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const ipx = createIPX({
	storage: ipxFSStorage({ dir: './public', maxAge: MAX_AGE }),
	maxAge: MAX_AGE,
	httpStorage: ipxHttpStorage({
		allowAllDomains: true,
		maxAge: MAX_AGE,
	}),
});

const handler = createIPXWebServer(ipx);

const server = Bun.serve({
	port: 3002,
	fetch: (request) => {
		return handler(request);
	},
	idleTimeout: 10,
});

console.log(
	`IPX service is running on http://${server.hostname}:${server.port}/`,
);
