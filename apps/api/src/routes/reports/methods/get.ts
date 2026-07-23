import { Tokens } from '@wanderlust/common';
import type { Reports } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { UserRolesProvider } from '@/routes/users/provides/roles';
import { os } from '../shared/router';

@injectable()
export class GetReportMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(UserRolesProvider) private readonly roles: UserRolesProvider,
	) {}

	route() {
		return os.get.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Reports.dto.GetInput,
	): Promise<Reports.dto.GetOutput> {
		const report = await this.db.query.reports.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(report, 'NOT_FOUND', `Report with id ${data.id} not found`);

		if (report.reporterId !== userId) {
			const isAdmin = await this.roles.isAdmin(userId);

			invariant(
				isAdmin,
				'FORBIDDEN',
				'You do not have permission to access this report',
			);
		}

		return {
			report,
		};
	}
}
