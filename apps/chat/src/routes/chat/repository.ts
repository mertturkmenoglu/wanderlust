import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import * as schema from '@wanderlust/db/schema';
import { inject, injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class ChatRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async list(userId: string): Promise<dto.ListOutput['chats']> {
		const ids = await this.db.query.chatParticipants.findMany({
			where: (t, { eq }) => eq(t.userId, userId),
			columns: {
				chatId: true,
			},
			orderBy: (t, { desc }) => [desc(t.lastReadAt)],
		});

		const chats = await this.db.query.chats.findMany({
			where: (t, { inArray }) =>
				inArray(
					t.id,
					ids.map((i) => i.chatId),
				),
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

		const directChats = chats.filter((chat) => chat.type === 'direct' && chat.directKey !== null).map((ch) => ({
			directKey: ch.directKey,
			otherUserId: ch.directKey?.split(':').find((id) => id !== userId) ?? '',
		}));

		const otherUsers = await this.db.query.users.findMany({
			where: (t, { inArray }) =>
				inArray(
					t.id,
					directChats.map((dc) => dc.otherUserId),
				),
			columns: {
				id: true,
				name: true,
				username: true,
				image: true,
			},
		});


		return chats.map((chat) => {
			if (chat.type === 'direct' && chat.directKey !== null) {
				const otherUserId = chat.directKey.split(':').find((id) => id !== userId);
				const otherUser = otherUsers.find((user) => user.id === otherUserId) ?? null;

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
	): Promise<dto.OpenOutput['chat']> {
		const directKey = [userId, otherUserId].toSorted().join(':');
		const otherUser = await this.db.query.users.findFirst({
			where: (t, { eq }) => eq(t.id, otherUserId),
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
			where: (t, { eq }) => eq(t.directKey, directKey),
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
				where: (t, { eq }) => eq(t.id, insertedChat.id),
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

	async info(userId: string, chatId: string): Promise<dto.InfoOutput['chat']> {
		const chats = await this.list(userId);

		const chat = chats.find((c) => c.id === chatId);

		if (!chat) {
			throw new Error('Chat not found');
		}

		return chat;
	}

	async hasDirectChat(userId: string, otherUserId: string): Promise<dto.HasDirectChatOutput['hasDirectChat']> {
		const directKey = [userId, otherUserId].toSorted().join(':');
		const existingChat = await this.db.query.chats.findFirst({
			where: (t, { eq }) => eq(t.directKey, directKey),
		});

		return !!existingChat;
	}
}
