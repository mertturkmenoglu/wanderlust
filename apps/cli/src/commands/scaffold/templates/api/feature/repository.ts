export const template = `
import type { {{feature}} as dto } from '@wanderlust/contract';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';

@injectable()
export class {{Feature}}Repository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
	) {
		this.db = db.get();
	}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
	  // TODO: Replace "places" with the actual table name
		const {{featureSingle}} = await this.db.query.places.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant({{featureSingle}}, 'NOT_FOUND', '{{FeatureSingle}} not found');

		invariant(false, 'NOT_IMPLEMENTED', 'This method is not implemented yet');
	}
}
`;
