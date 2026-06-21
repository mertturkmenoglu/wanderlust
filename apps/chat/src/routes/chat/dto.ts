import { $dto } from "@wanderlust/common";
import z from "zod";

export const sender = $dto.user.pick({
	id: true,
	name: true,
	username: true,
	image: true,
});

export const lastMessageExtended = $dto.message.extend({
	sender: sender.nullable(),
});

export const chatExtended = $dto.chat.extend({
	lastMessage: lastMessageExtended.nullable(),
	otherUser: sender.nullable(),
});

export const listInput = z.object({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
	chats: chatExtended.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const openInput = z.object({
	id: z.string(),
});

export type OpenInput = z.infer<typeof openInput>;

export const openOutput = z.object({
	chat: chatExtended,
});

export type OpenOutput = z.infer<typeof openOutput>;

export const infoInput = z.object({
	id: z.string(),
});

export type InfoInput = z.infer<typeof infoInput>;

export const infoOutput = z.object({
	chat: chatExtended,
});

export type InfoOutput = z.infer<typeof infoOutput>;
