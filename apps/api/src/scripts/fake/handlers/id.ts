import { $ } from 'bun';

export async function generate() {
	await $`bun run src/scripts/fake-id.ts`;
}
