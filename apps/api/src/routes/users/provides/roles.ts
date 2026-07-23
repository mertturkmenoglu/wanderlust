import { Tokens } from '@wanderlust/common';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRolesProvider {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async isAdmin(userId: string): Promise<boolean> {
		const user = await this.db.query.users.findFirst({
			where: {
				id: userId,
			},
		});

		return user?.role === 'admin';
	}
}
