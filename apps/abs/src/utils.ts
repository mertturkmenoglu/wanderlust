import type { Agent } from './agent';
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

export const CHARS = {
	BLANK: '\u2800', // Braille Pattern Blank
};

export function logged(
	target: object,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const original = descriptor.value;
	descriptor.value = async function (...args: any[]) {
		const agent = args[0] as Agent;
		const tag = `${propertyKey}:${agent.getUsername()}`;
		agent.getLogger().info(`Executing action: ${tag}`);
		return original.apply(this, args);
	};
	return descriptor;
}

export namespace $ {
	export namespace Random {
		export function element<T>(arr: T[]): T {
			if (arr.length === 0) {
				throw new Error('Cannot select a random element from an empty array');
			}

			const randomIndex = Math.floor(Math.random() * arr.length);
			const el = arr[randomIndex];

			if (el === undefined) {
				throw new Error('Randomly selected element is undefined');
			}

			return el;
		}

		export function int(min: number, max: number): number {
			if (min > max) {
				throw new Error('Min cannot be greater than max');
			}
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
}
