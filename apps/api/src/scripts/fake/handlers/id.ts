import { $ } from 'bun';

export async function generate() {
	await $`./src/scripts/fake-id.sh`;
}
