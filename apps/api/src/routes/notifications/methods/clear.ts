import { Tokens } from '@wanderlust/common';
import type { Notifications } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { os } from '../shared/router';

@injectable()
export class ClearNotificationsMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.clear.handler(async ({ context }) => {
			const userId = context.session.user.id;
			const result = await this.execute(userId);

			return result;
		});
	}

	private async execute(
		userId: string,
	): Promise<Notifications.dto.ClearOutput> {
		await this.db
			.delete(schema.notifications)
			.where(eq(schema.notifications.recipientId, userId));

		return {};
	}
}
