import { useMemo } from 'react';
import { useChatContext } from '@/stores/chat-context';

export function useChatTitle() {
	const ctx = useChatContext();

	const title = useMemo(() => {
		if (!ctx.chat) {
			return '';
		}

		if (ctx.chat.name) {
			return ctx.chat.name;
		}

		if (ctx.chat.otherUser) {
			return ctx.chat.otherUser.name;
		}

		return '';
	}, [ctx.chat]);

	return title;
}

export function useChatImage() {
	const ctx = useChatContext();

	const image = useMemo(() => {
		if (!ctx.chat) {
			return null;
		}

		if (ctx.chat.name) {
			return ctx.chat.imageUrl;
		}

		if (ctx.chat.otherUser) {
			return ctx.chat.otherUser.image;
		}

		return null;
	}, [ctx.chat]);

	return image;
}
