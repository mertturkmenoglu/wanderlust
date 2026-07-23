import { Tokens } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class UpdateReportMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update.use(isAdmin).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reports.dto.UpdateInput,
	): Promise<Reports.dto.UpdateOutput> {
		const [report] = await this.db
			.update(schema.reports)
			.set({
				description: data.description,
				reason: data.reason,
				resolved: data.resolved,
				resolvedAt: data.resolved ? new Date() : null,
			})
			.where(eq(schema.reports.id, data.id))
			.returning();

		invariant(report, 'NOT_FOUND', `Report with id ${data.id} not found`);

		return {
			report,
		};
	}
}
