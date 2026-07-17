import type { Notifications } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { TraceAll } from '@/lib/tracer';
import { NotificationsRepository } from './repository';

@injectable()
@TraceAll()
export class NotificationsService {
	constructor(
		@inject(NotificationsRepository)
		private readonly repo: NotificationsRepository,
	) {}

	public async list(
		userId: string,
		input: Notifications.dto.ListInput,
	): Promise<Notifications.dto.ListOutput> {
		const result = await this.repo.list(userId, input);
		return result;
	}

	public async markRead(
		userId: string,
		input: Notifications.dto.MarkReadInput,
	): Promise<Notifications.dto.MarkReadOutput> {
		const result = await this.repo.markRead(userId, input);
		return result;
	}

	public async markAllRead(
		userId: string,
		input: Notifications.dto.MarkAllReadInput,
	): Promise<Notifications.dto.MarkAllReadOutput> {
		const result = await this.repo.markAllRead(userId, input);
		return result;
	}

	public async clear(
		userId: string,
		input: Notifications.dto.ClearInput,
	): Promise<Notifications.dto.ClearOutput> {
		const result = await this.repo.clear(userId, input);
		return result;
	}

	public async preferences(
		userId: string,
		input: Notifications.dto.PreferencesInput,
	): Promise<Notifications.dto.PreferencesOutput> {
		const result = await this.repo.preferences(userId, input);
		return result;
	}

	public async updatePreferences(
		userId: string,
		input: Notifications.dto.UpdatePreferencesInput,
	): Promise<Notifications.dto.UpdatePreferencesOutput> {
		const result = await this.repo.updatePreferences(userId, input);
		return result;
	}
}
