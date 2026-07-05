import { ConfigService, type TConfigService } from '@wanderlust/config';
import type { notifications as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class NotificationsRepository {
	private readonly db: TDatabaseService;
	private readonly cfg: TConfigService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(ConfigService) cfg: ConfigService,
	) {
		this.db = db.get();
		this.cfg = cfg.get();
	}

	async list(userId: string, _input: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.db.query.notifications.findMany({
			where: {
				recipientId: userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			limit: this.cfg.notifications.capPerUser,
		});

		return {
			notifications: result,
		};
	}

	async markRead(
		userId: string,
		input: dto.MarkReadInput,
	): Promise<dto.MarkReadOutput> {
		const result = await this.db
			.update(schema.notifications)
			.set({
				readAt: new Date(),
			})
			.where(
				and(
					eq(schema.notifications.id, input.id),
					eq(schema.notifications.recipientId, userId),
				),
			);

		invariant(result.rowCount === 1, 'NOT_FOUND', 'Notification not found');

		return {
			success: true,
		};
	}

	async markAllRead(
		userId: string,
		_input: dto.MarkAllReadInput,
	): Promise<dto.MarkAllReadOutput> {
		await this.db
			.update(schema.notifications)
			.set({
				readAt: new Date(),
			})
			.where(eq(schema.notifications.recipientId, userId));

		return {
			success: true,
		};
	}

	async clear(
		userId: string,
		_input: dto.ClearInput,
	): Promise<dto.ClearOutput> {
		await this.db
			.delete(schema.notifications)
			.where(eq(schema.notifications.recipientId, userId));

		return {
			success: true,
		};
	}

	async preferences(
		userId: string,
		_input: dto.PreferencesInput,
	): Promise<dto.PreferencesOutput> {
		const result = await this.db.query.notificationPreferences.findMany({
			where: {
				userId: userId,
			},
		});

		return {
			preferences: result,
		};
	}

	async updatePreferences(
		userId: string,
		input: dto.UpdatePreferencesInput,
	): Promise<dto.UpdatePreferencesOutput> {
		await this.db
			.insert(schema.notificationPreferences)
			.values({
				...input,
				userId: userId,
			})
			.onConflictDoUpdate({
				target: [
					schema.notificationPreferences.userId,
					schema.notificationPreferences.channel,
					schema.notificationPreferences.category,
				],
				set: {
					enabled: input.enabled,
				},
			});

		return {
			success: true,
		};
	}
}
