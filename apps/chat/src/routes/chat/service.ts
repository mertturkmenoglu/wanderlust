import { ORPCError } from '@orpc/client';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';
import { ChatRepository } from './repository';

@injectable()
export class ChatService {
	constructor(
		@inject(ChatRepository) private readonly repository: ChatRepository,
	) { }

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
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

	async hasDirectChat(
		userId: string,
		data: dto.HasDirectChatInput,
	): Promise<dto.HasDirectChatOutput> {
		const hasDirectChat = await this.repository.hasDirectChat(
			userId,
			data.id,
		);

		return {
			hasDirectChat,
		};
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async leave(userId: string, data: dto.LeaveInput): Promise<dto.LeaveOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async clear(userId: string, data: dto.ClearInput): Promise<dto.ClearOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async markRead(
		userId: string,
		data: dto.MarkReadInput,
	): Promise<dto.MarkReadOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async pin(userId: string, data: dto.PinInput): Promise<dto.PinOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unpin(userId: string, data: dto.UnpinInput): Promise<dto.UnpinOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unread(
		userId: string,
		data: dto.UnreadInput,
	): Promise<dto.UnreadOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async mute(userId: string, data: dto.MuteInput): Promise<dto.MuteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unmute(
		userId: string,
		data: dto.UnmuteInput,
	): Promise<dto.UnmuteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}
}
