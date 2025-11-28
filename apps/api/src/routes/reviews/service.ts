/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import path from 'node:path';
import { ORPCError } from '@orpc/server';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import type { TCacheService } from '@/lib/cache';
import { getFilenameFromUrl, type TStorageService } from '@/lib/storage';
import { nanoid } from '@/lib/uid';
import type * as dto from './dto';
import type { ReviewsRepository } from './repository';

export class ReviewsService {
	constructor(
		private readonly repo: ReviewsRepository,
		private readonly storage: TStorageService,
		private readonly cache: TCacheService,
	) {}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(data);

		return {
			review: result,
		};
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const files = data.files || [];
		const urls: string[] = [];
		const filetypes: FileTypeResult[] = [];

		if (files.length > 0) {
			for (const file of files) {
				const t = await fileTypeFromBlob(file);

				if (!t) {
					throw new ORPCError('UNPROCESSABLE_CONTENT', {
						message: 'One or more files have an unsupported file type',
					});
				}

				if (!['image/jpeg', 'image/png', 'image/webp'].includes(t.mime)) {
					throw new ORPCError('UNPROCESSABLE_CONTENT', {
						message: 'One or more files have an unsupported file type',
					});
				}

				filetypes.push(t);
			}

			for (let i = 0; i < files.length; i++) {
				const id = nanoid();
				const file = files[i]!;
				const filetype = filetypes[i]!;
				const filename = `${id}.${filetype.ext}`;
				const filepath = path.join('reviews', filename);

				try {
					await this.storage.put(
						filepath,
						Buffer.from(await file.arrayBuffer()),
						{
							contentType: filetype.mime,
						},
					);

					const url = await this.storage.getUrl(filepath);
					urls.push(url);
				} catch (err) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to upload review files',
						cause: err,
					});
				}
			}
		}

		const result = await this.repo.create(userId, data, urls);

		return {
			review: result,
		};
	}

	async _delete(userId: string, data: dto.DeleteInput): Promise<void> {
		const existing = await this.repo.get(data);

		if (existing.userId !== userId) {
			throw new ORPCError('FORBIDDEN', {
				message: 'You are not authorized to delete this review',
			});
		}

		await this.repo._delete(userId, data);

		try {
			const filenames = existing.assets.map((asset) =>
				getFilenameFromUrl(asset.url),
			);

			if (filenames.length > 0) {
				for (const filename of filenames) {
					await this.storage.delete(`reviews/${filename}`);
				}
			}
		} catch (err) {
			console.error('Failed to delete review assets from storage', err);
		}
	}

	async listByUsername(
		data: dto.ListByUsernameInput,
	): Promise<dto.ListByUsernameOutput> {
		const result = await this.repo.listByUsername(data);

		return {
			reviews: result.reviews,
			pagination: result.pagination,
		};
	}

	async listByPlaceId(
		data: dto.ListByPlaceIdInput,
	): Promise<dto.ListByPlaceIdOutput> {
		const result = await this.repo.listByPlaceId(data);

		return {
			reviews: result.reviews,
			pagination: result.pagination,
		};
	}

	async getRatings(data: dto.GetRatingsInput): Promise<dto.GetRatingsOutput> {
		const result = await this.cache.namespace('reviews-ratings').getOrSet({
			key: `place-${data.id}`,
			ttl: '30m',
			factory: async () => this.repo.getRatings(data),
		});

		return result;
	}

	async listAssetsByPlaceId(
		data: dto.ListAssetsByPlaceIdInput,
	): Promise<dto.ListAssetsByPlaceIdOutput> {
		const result = await this.repo.listAssetsByPlaceId(data);

		return result;
	}
}
