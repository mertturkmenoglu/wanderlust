import {
	createIPX,
	createIPXWebServer,
	ipxFSStorage,
	ipxHttpStorage,
} from 'ipx';

const ipx = createIPX({
	storage: ipxFSStorage({ dir: './public' }),
	maxAge: 60 * 60 * 24,
	httpStorage: ipxHttpStorage({
		allowAllDomains: true,
	}),
});

const handler = createIPXWebServer(ipx);

const server = Bun.serve({
	port: 3002,
	fetch: (request) => {
		return handler(request);
	},
});

console.log(
	`IPX service is running on http://${server.hostname}:${server.port}/`,
);
