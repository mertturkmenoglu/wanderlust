import type { notifications as dto } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { NotificationsRepository } from './repository';

@injectable()
export class NotificationsService {
	constructor(
		@inject(NotificationsRepository)
		private readonly repo: NotificationsRepository,
	) {}

	public async list(
		userId: string,
		input: dto.ListInput,
	): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, input);
		return result;
	}

	public async markRead(
		userId: string,
		input: dto.MarkReadInput,
	): Promise<dto.MarkReadOutput> {
		const result = await this.repo.markRead(userId, input);
		return result;
	}

	public async markAllRead(
		userId: string,
		input: dto.MarkAllReadInput,
	): Promise<dto.MarkAllReadOutput> {
		const result = await this.repo.markAllRead(userId, input);
		return result;
	}

	public async clear(
		userId: string,
		input: dto.ClearInput,
	): Promise<dto.ClearOutput> {
		const result = await this.repo.clear(userId, input);
		return result;
	}

	public async preferences(
		userId: string,
		input: dto.PreferencesInput,
	): Promise<dto.PreferencesOutput> {
		const result = await this.repo.preferences(userId, input);
		return result;
	}

	public async updatePreferences(
		userId: string,
		input: dto.UpdatePreferencesInput,
	): Promise<dto.UpdatePreferencesOutput> {
		const result = await this.repo.updatePreferences(userId, input);
		return result;
	}
}
