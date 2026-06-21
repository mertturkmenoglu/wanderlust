import { ORPCError } from '@orpc/server';
import { injectable } from 'inversify';
import type * as dto from './dto';

@injectable()
export class ComposeService {
	async unfurlLink(userId: string, data: dto.UnfurlLinkInput): Promise<dto.UnfurlLinkOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async gifSearch(userId: string, data: dto.GifSearchInput): Promise<dto.GifSearchOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}

	async stickerList(userId: string, data: dto.StickerListInput): Promise<dto.StickerListOutput> {
		throw new ORPCError('NOT_IMPLEMENTED', {
			message: 'Not implemented yet',
		});
	}
}
