import { ORPCError } from '@orpc/client';
import type { chats } from '@wanderlust/contract';
import { inject, injectable } from 'inversify';
import { ChatRepository } from './repository';

@injectable()
export class ChatService {
	constructor(
		@inject(ChatRepository) private readonly repository: ChatRepository,
	) {}

	async list(
		userId: string,
		_data: chats.chats.dto.ListInput,
	): Promise<chats.chats.dto.ListOutput> {
		const chats = await this.repository.list(userId);

		return {
			chats,
		};
	}

	async open(
		userId: string,
		data: chats.chats.dto.OpenInput,
	): Promise<chats.chats.dto.OpenOutput> {
		const chat = await this.repository.open(userId, data.id);

		return {
			chat,
		};
	}

	async info(
		userId: string,
		data: chats.chats.dto.InfoInput,
	): Promise<chats.chats.dto.InfoOutput> {
		const chat = await this.repository.info(userId, data.id);

		return {
			chat,
		};
	}

	async hasDirectChat(
		userId: string,
		data: chats.chats.dto.HasDirectChatInput,
	): Promise<chats.chats.dto.HasDirectChatOutput> {
		const hasDirectChat = await this.repository.hasDirectChat(userId, data.id);

		return {
			hasDirectChat,
		};
	}

	async create(
		_userId: string,
		_data: chats.chats.dto.CreateInput,
	): Promise<chats.chats.dto.CreateOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async update(
		_userId: string,
		_data: chats.chats.dto.UpdateInput,
	): Promise<chats.chats.dto.UpdateOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async leave(
		_userId: string,
		_data: chats.chats.dto.LeaveInput,
	): Promise<chats.chats.dto.LeaveOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async clear(
		_userId: string,
		_data: chats.chats.dto.ClearInput,
	): Promise<chats.chats.dto.ClearOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async markRead(
		_userId: string,
		_data: chats.chats.dto.MarkReadInput,
	): Promise<chats.chats.dto.MarkReadOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async pin(
		_userId: string,
		_data: chats.chats.dto.PinInput,
	): Promise<chats.chats.dto.PinOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unpin(
		_userId: string,
		_data: chats.chats.dto.UnpinInput,
	): Promise<chats.chats.dto.UnpinOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unread(
		_userId: string,
		_data: chats.chats.dto.UnreadInput,
	): Promise<chats.chats.dto.UnreadOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async mute(
		_userId: string,
		_data: chats.chats.dto.MuteInput,
	): Promise<chats.chats.dto.MuteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async unmute(
		_userId: string,
		_data: chats.chats.dto.UnmuteInput,
	): Promise<chats.chats.dto.UnmuteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async delete(
		_userId: string,
		_data: chats.chats.dto.DeleteInput,
	): Promise<chats.chats.dto.DeleteOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}
}
