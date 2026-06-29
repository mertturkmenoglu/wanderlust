import { ORPCError } from '@orpc/server';
import type { chats } from '@wanderlust/contract';
import { injectable } from 'inversify';

@injectable()
export class ComposeService {
	async unfurlLink(
		_userId: string,
		_data: chats.compose.dto.UnfurlLinkInput,
	): Promise<chats.compose.dto.UnfurlLinkOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async gifSearch(
		_userId: string,
		_data: chats.compose.dto.GifSearchInput,
	): Promise<chats.compose.dto.GifSearchOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async stickerList(
		_userId: string,
		_data: chats.compose.dto.StickerListInput,
	): Promise<chats.compose.dto.StickerListOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}
}
