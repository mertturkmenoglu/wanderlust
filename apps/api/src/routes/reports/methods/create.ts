import { Tokens } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';

@injectable()
export class CreateReportMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Reports.dto.CreateInput,
	): Promise<Reports.dto.CreateOutput> {
		const [report] = await this.db
			.insert(schema.reports)
			.values({
				reporterId: userId,
				resourceId: data.resourceId,
				resourceType: data.resourceType,
				reason: data.reason,
				description: data.description,
				id: nanoid(),
			})
			.returning();

		invariant(report, 'INTERNAL_SERVER_ERROR', 'No report item returned');

		return {
			report,
		};
	}
}
