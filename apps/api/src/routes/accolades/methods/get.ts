import { Tokens } from '@wanderlust/common';
import type { Accolades } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class GetAccoladeMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.get.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Accolades.dto.GetInput,
	): Promise<Accolades.dto.GetOutput> {
		const accolade = await this.db.query.accolades.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(accolade, 'NOT_FOUND', 'Accolade not found');

		return { accolade };
	}
}
