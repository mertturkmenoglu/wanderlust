import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class ListPlacesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.list
			.use(requireAuth)
			.use(isAdmin)
			.handler(async () => {
				const result = await this.execute();

				return result;
			});
	}

	private async execute(): Promise<Places.dto.ListOutput> {
		const places = await this.db.query.places.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			offset: 0,
			limit: 25,
			with: $includes.place.with,
		});

		return {
			places,
		};
	}
}
