import { $dto } from "@wanderlust/common";
import z from "zod";

export const sender = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	image: z.string().nullable(),
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

export const createInput = z.object({
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({

});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = z.object({
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({

});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const leaveInput = z.object({
});

export type LeaveInput = z.infer<typeof leaveInput>;

export const leaveOutput = z.object({

});

export type LeaveOutput = z.infer<typeof leaveOutput>;

export const clearInput = z.object({
});

export type ClearInput = z.infer<typeof clearInput>;

export const clearOutput = z.object({

});

export type ClearOutput = z.infer<typeof clearOutput>;

export const markReadInput = z.object({
});

export type MarkReadInput = z.infer<typeof markReadInput>;

export const markReadOutput = z.object({
});

export type MarkReadOutput = z.infer<typeof markReadOutput>;

export const pinInput = z.object({
});

export type PinInput = z.infer<typeof pinInput>;

export const pinOutput = z.object({
});

export type PinOutput = z.infer<typeof pinOutput>;

export const unpinInput = z.object({
});

export type UnpinInput = z.infer<typeof unpinInput>;

export const unpinOutput = z.object({
});

export type UnpinOutput = z.infer<typeof unpinOutput>;

export const unreadInput = z.object({
});

export type UnreadInput = z.infer<typeof unreadInput>;

export const unreadOutput = z.object({
});

export type UnreadOutput = z.infer<typeof unreadOutput>;

export const muteInput = z.object({
});

export type MuteInput = z.infer<typeof muteInput>;

export const muteOutput = z.object({
});

export type MuteOutput = z.infer<typeof muteOutput>;

export const unmuteInput = z.object({
});

export type UnmuteInput = z.infer<typeof unmuteInput>;

export const unmuteOutput = z.object({
});

export type UnmuteOutput = z.infer<typeof unmuteOutput>;

export const deleteInput = z.object({
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({
});

export type DeleteOutput = z.infer<typeof deleteOutput>;
