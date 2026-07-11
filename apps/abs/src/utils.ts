import { client } from './orpc';

async function apiHealthCheck(): Promise<boolean> {
	try {
		await client.health.check({});
		return true;
	} catch {
		return false;
	}
}

export function waitUntilApiIsHealthy(): Promise<void> {
	return new Promise((resolve) => {
		const interval = setInterval(async () => {
			const healthy = await apiHealthCheck();
			if (healthy) {
				clearInterval(interval);
				resolve();
			}
		}, 1000);
	});
}
