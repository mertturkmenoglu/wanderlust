import path from 'node:path';
import type { Auth } from './auth';

export namespace Persistence {
	const filepath = path.join('tmp', 'state.json');

	export async function load(): Promise<
		[Map<string, string>, Map<string, Auth.User>]
	> {
		const file = Bun.file(filepath);
		const exists = await file.exists();

		if (!exists) {
			return [new Map(), new Map()];
		}

		const content = await file.json();

		const tokens = new Map<string, string>(content.tokens);
		const users = new Map<string, Auth.User>(content.users);

		return [tokens, users];
	}

	export async function save(
		tokens: Map<string, string>,
		users: Map<string, Auth.User>,
	) {
		const file = Bun.file(filepath);
		const content = {
			tokens: Array.from(tokens.entries()),
			users: Array.from(users.entries()),
		};
		await Bun.write(file, JSON.stringify(content));
	}
}
