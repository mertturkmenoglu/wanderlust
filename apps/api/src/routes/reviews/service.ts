/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import path from 'node:path';
import { ORPCError } from '@orpc/server';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { CacheService, type TCacheService } from '@/lib/cache';
import {
	createPathname,
	getFilenameFromUrl,
	StorageService,
	type TStorageService
} from '@/lib/storage';
import { nanoid } from '@/lib/uid';
import type * as dto from './dto';
import { ReviewsRepository } from './repository';

@injectable()
export class ReviewsService {
	private readonly storage: TStorageService;
	private readonly cache: TCacheService;

	constructor(
		@inject(ReviewsRepository) private readonly repo: ReviewsRepository,
		@inject(StorageService) storage: StorageService,
		@inject(CacheService) cache: CacheService,
	) {
		this.storage = storage.get();
		this.cache = cache.get();
	}

	async get(data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(data);

		return {
			review: result,
		};
	}

	private async getFileTypes(files: File[]): Promise<FileTypeResult[]> {
		const filetypes: FileTypeResult[] = [];

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

		return filetypes;
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const files = data.files || [];
		const urls: string[] = [];

		if (files.length > 0) {
			const filetypes: FileTypeResult[] = await this.getFileTypes(files);

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
				} catch (_err) {
					// Cleanup any files that were uploaded before the error occurred
					await this.removeAssets(urls);

					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to upload review files',
					});
				}
			}
		}

		try {
			const result = await this.repo.create(userId, data, urls);

			await this.cache.namespace('reviews-ratings').delete({
				key: `place-${data.placeId}`,
			});

			return {
				review: result,
			};
		} catch (_err) {
			await this.removeAssets(urls);

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create review',
			});
		}
	}

	private async removeAssets(urls: string[]): Promise<boolean> {
		let allDeleted = true;

		for (const url of urls) {
			const filename = getFilenameFromUrl(url);
			const pathname = createPathname('reviews', filename);

			try {
				await this.storage.delete(pathname);
			} catch (err) {
				allDeleted = false;

				console.error(
					'Failed to delete review asset from storage during cleanup',
					err,
				);
			}
		}

		return allDeleted;
	}

	async _delete(userId: string, data: dto.DeleteInput): Promise<void> {
		const existing = await this.repo.get(data);

		if (existing.userId !== userId) {
			throw new ORPCError('FORBIDDEN', {
				message: 'You are not authorized to delete this review',
			});
		}

		const deleted = await this.repo._delete(userId, data);
		const allAssetsDeleted = await this.removeAssets(existing.assets.map((asset) => asset.url));

		if (!allAssetsDeleted) {
			console.warn(
				`Failed to delete one or more review assets for review ${data.id}`,
			);
		}

		await this.cache.namespace('reviews-ratings').delete({
			key: `place-${deleted.placeId}`,
		});
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
