import { ConfigService, type TConfigService } from '@wanderlust/config';
import type { Notifications } from '@wanderlust/contract';
import { DatabaseService, schema, type TDatabaseService } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import {
	findManyByRecipientId,
	findManyPreferencesByUserId,
} from './statements';

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

	async list(
		userId: string,
		_input: Notifications.dto.ListInput,
	): Promise<Notifications.dto.ListOutput> {
		const notifications = await findManyByRecipientId.execute(this.db, {
			recipientId: userId,
			limit: this.cfg.notifications.capPerUser,
		});

		return {
			notifications,
		};
	}

	async markRead(
		userId: string,
		input: Notifications.dto.MarkReadInput,
	): Promise<Notifications.dto.MarkReadOutput> {
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
		_input: Notifications.dto.MarkAllReadInput,
	): Promise<Notifications.dto.MarkAllReadOutput> {
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
		_input: Notifications.dto.ClearInput,
	): Promise<Notifications.dto.ClearOutput> {
		await this.db
			.delete(schema.notifications)
			.where(eq(schema.notifications.recipientId, userId));

		return {};
	}

	async preferences(
		userId: string,
		_input: Notifications.dto.PreferencesInput,
	): Promise<Notifications.dto.PreferencesOutput> {
		const preferences = await findManyPreferencesByUserId.execute(this.db, {
			userId,
		});

		return {
			preferences,
		};
	}

	async updatePreferences(
		userId: string,
		input: Notifications.dto.UpdatePreferencesInput,
	): Promise<Notifications.dto.UpdatePreferencesOutput> {
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
