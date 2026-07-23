import crypto from 'node:crypto';
import { ORPCError } from '@orpc/server';
import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { getFilenameFromUrl, type StorageService } from '@wanderlust/storage';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { transformFile } from '../shared/file-transformation';
import { getFileType } from '../shared/file-type';
import { os } from '../shared/router';
import { findUserById } from '../shared/statements';

@injectable()
export class UpdateImageMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Storage) private readonly storage: StorageService,
	) {}

	route() {
		return os.updateImage.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Users.dto.UpdateImageInput,
	): Promise<Users.dto.UpdateImageOutput> {
		void (await getFileType(data.file));

		const transformed = await transformFile(data.file, data.type);

		const id = crypto.randomUUID();
		const filename = `${id}.webp`;
		const bucket = data.type === 'profile' ? 'profile-images' : 'banner-images';

		try {
			await this.storage.use(bucket).put(filename, transformed.buffer, {
				contentType: 'image/webp',
			});

			const url = await this.storage.use(bucket).getUrl(filename);
			const result = await this.updateImage(userId, data.type, url);

			try {
				if (result.previousUrl) {
					const filename = getFilenameFromUrl(result.previousUrl);

					if (filename !== '') {
						await this.storage.use(bucket).delete(filename);
					}
				}
			} catch (err) {
				// If the deletion fails and the previous URL is not null, then log the error but do not fail the whole operation
				if (result.previousUrl !== null) {
					console.error('Failed to delete previous image from storage', err);
				}
			}

			return {
				profile: result.profile,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to upload image',
			});
		}
	}

	private async updateImage(
		userId: string,
		type: 'profile' | 'banner',
		url: string,
	) {
		const user = await findUserById.execute(this.db, { id: userId });

		invariant(user, 'NOT_FOUND', `User with id ${userId} not found`);

		const previousUrl = type === 'profile' ? user.image : user.banner;

		await this.db
			.update(schema.users)
			.set(type === 'profile' ? { image: url } : { banner: url })
			.where(eq(schema.users.id, userId));

		const result = await findUserById.execute(this.db, {
			id: userId,
		});

		invariant(result, 'NOT_FOUND', `User with id ${userId} not found`);

		return {
			profile: result,
			previousUrl,
		};
	}
}
