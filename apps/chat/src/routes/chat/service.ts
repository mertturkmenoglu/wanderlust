import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { ChatRepository } from './repository';

@injectable()
export class ChatService {
	constructor(
		@inject(ChatRepository) private readonly repository: ChatRepository,
	) { }

	async list(userId: string): Promise<dto.ListOutput> {
		const chats = await this.repository.list(userId);

		return {
			chats,
		};
	}

	async open(userId: string, data: dto.OpenInput): Promise<dto.OpenOutput> {
		const chat = await this.repository.open(userId, data.id);

		return {
			chat,
		};
	}

	async info(userId: string, data: dto.InfoInput): Promise<dto.InfoOutput> {
		const chat = await this.repository.info(userId, data.id);

		return {
			chat,
		};
	}
}
