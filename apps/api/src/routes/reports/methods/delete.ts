import { Tokens } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class DeleteReportMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete.use(isAdmin).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reports.dto.DeleteInput,
	): Promise<Reports.dto.DeleteOutput> {
		const result = await this.db
			.delete(schema.reports)
			.where(eq(schema.reports.id, data.id));

		invariant(
			result.rowCount === 1,
			'NOT_FOUND',
			`Report with id ${data.id} not found`,
		);

		return {};
	}
}
