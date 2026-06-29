import type { chats } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';

@injectable()
export class ChatRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async list(userId: string): Promise<chats.chats.dto.ListOutput['chats']> {
		const ids = await this.db.query.chatParticipants.findMany({
			where: {
				userId: userId,
			},
			columns: {
				chatId: true,
			},
			orderBy: {
				lastReadAt: 'desc',
			},
		});

		const chats = await this.db.query.chats.findMany({
			where: {
				id: {
					in: ids.map((i) => i.chatId),
				},
			},
			with: {
				lastMessage: {
					with: {
						sender: {
							columns: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
					},
				},
			},
		});

		const directChats = chats
			.filter((chat) => chat.type === 'direct' && chat.directKey !== null)
			.map((ch) => ({
				directKey: ch.directKey,
				otherUserId: ch.directKey?.split(':').find((id) => id !== userId) ?? '',
			}));

		const otherUsers = await this.db.query.users.findMany({
			where: {
				id: {
					in: directChats.map((dc) => dc.otherUserId),
				},
			},
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		});

		return chats.map((chat) => {
			if (chat.type === 'direct' && chat.directKey !== null) {
				const otherUserId = chat.directKey
					.split(':')
					.find((id) => id !== userId);
				const otherUser =
					otherUsers.find((user) => user.id === otherUserId) ?? null;

				return {
					...chat,
					otherUser: otherUser,
				};
			}

			return {
				...chat,
				otherUser: null,
			};
		});
	}

	async open(
		userId: string,
		otherUserId: string,
	): Promise<chats.chats.dto.OpenOutput['chat']> {
		const directKey = [userId, otherUserId].toSorted().join(':');
		const otherUser = await this.db.query.users.findFirst({
			where: {
				id: otherUserId,
			},
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		});

		if (!otherUser) {
			throw new Error('User not found');
		}

		const existingChat = await this.db.query.chats.findFirst({
			where: {
				directKey: directKey,
			},
			with: {
				lastMessage: {
					with: {
						sender: {
							columns: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
					},
				},
			},
		});

		if (existingChat) {
			return {
				...existingChat,
				otherUser: otherUser,
			};
		}

		const newChat = await this.db.transaction(async (tx) => {
			const [insertedChat] = await tx
				.insert(schema.chats)
				.values({
					type: 'direct',
					directKey: directKey,
					creatorId: userId,
				})
				.returning();

			if (!insertedChat) {
				throw new Error('Failed to create chat');
			}

			await tx.insert(schema.chatParticipants).values([
				{
					chatId: insertedChat.id,
					userId: userId,
					joinedAt: new Date(),
				},
				{
					chatId: insertedChat.id,
					userId: otherUserId,
					joinedAt: new Date(),
				},
			]);

			const newChat = await tx.query.chats.findFirst({
				where: {
					id: insertedChat.id,
				},
				with: {
					lastMessage: {
						with: {
							sender: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
				},
			});

			return newChat;
		});

		if (!newChat) {
			throw new Error('Failed to create chat');
		}

		return {
			...newChat,
			otherUser: otherUser,
		};
	}

	async info(
		userId: string,
		chatId: string,
	): Promise<chats.chats.dto.InfoOutput['chat']> {
		const chats = await this.list(userId);

		const chat = chats.find((c) => c.id === chatId);

		if (!chat) {
			throw new Error('Chat not found');
		}

		return chat;
	}

	async hasDirectChat(
		userId: string,
		otherUserId: string,
	): Promise<chats.chats.dto.HasDirectChatOutput['hasDirectChat']> {
		const directKey = [userId, otherUserId].toSorted().join(':');
		const existingChat = await this.db.query.chats.findFirst({
			where: {
				directKey: directKey,
			},
		});

		return !!existingChat;
	}
}
