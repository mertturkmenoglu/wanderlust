import path from 'node:path';

export const CustomStorage = {
	getItem: async (name: string) => {
		const filepath = path.join('tmp', 'agents', name);
		const file = Bun.file(filepath);
		const exists = await file.exists();
		if (!exists) return null;
		return await file.json();
	},
	removeItem: async (name: string) => {
		const filepath = path.join('tmp', 'agents', name);
		const file = Bun.file(filepath);
		await file.delete();
	},
	setItem: async (name: string, value: unknown) => {
		const filepath = path.join('tmp', 'agents', name);
		const file = Bun.file(filepath);
		await file.write(JSON.stringify(value));
	},
};
