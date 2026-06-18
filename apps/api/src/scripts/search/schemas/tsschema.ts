import type { TDatabaseService } from '@wanderlust/db';
import type { Client } from 'typesense';
import { isCollectionNotFoundError } from '../err-utils';

export abstract class TSSchema {
	protected readonly name: string;

	protected readonly client: Client;

	protected readonly db: TDatabaseService;

	constructor(name: string, client: Client, db: TDatabaseService) {
		this.name = name;
		this.client = client;
		this.db = db;
	}

	abstract createCollection(): Promise<void>;

	async deleteCollection() {
		await this.client
			.collections(this.name)
			.delete()
			.catch((err) => {
				if (isCollectionNotFoundError(err)) {
					console.error({ message: err.message });
					return;
				}

				throw err;
			});
	}

	abstract sync(): Promise<void>;
}
