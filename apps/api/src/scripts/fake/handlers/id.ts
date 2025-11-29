import { $ } from 'bun';

export async function generate() {
	await $`./scripts/fake-id.sh`;
}
