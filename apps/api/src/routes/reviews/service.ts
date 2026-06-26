/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { ORPCError } from '@orpc/server';
import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { reviews as dto } from '@wanderlust/contract';
import {
	getFilenameFromUrl,
	StorageService,
	type TStorageService,
} from '@wanderlust/storage';
import { nanoid } from '@wanderlust/uid';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { ReviewsRepository } from './repository';

@injectable()
export class ReviewsService {
	private readonly storage: TStorageService;
	private readonly cache: TCacheService;

	constructor(
		@inject(ReviewsRepository) private readonly repo: ReviewsRepository,
		@inject(StorageService) storage: StorageService,
		@inject(CacheService) cache: CacheService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
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

	async create(
		userId: string,
		username: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		const files = data.files || [];
		const urls = await this.uploadFiles(files);

		try {
			const [insertResult, place] = await this.repo.create(userId, data, urls);

			await this.cache.namespace('reviews-ratings').delete({
				key: data.placeId,
			});

			await this.activities.addActivity(username, 'create_review', {
				review: {
					id: insertResult.id,
					place: {
						id: place.id,
						name: place.name,
					},
				},
			});

			return {
				review: insertResult,
			};
		} catch {
			await this.removeAssets(urls);

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create review',
			});
		}
	}

	async _delete(userId: string, data: dto.DeleteInput): Promise<void> {
		const existing = await this.repo.get(data);

		if (existing.userId !== userId) {
			throw new ORPCError('FORBIDDEN', {
				message: 'You are not authorized to delete this review',
			});
		}

		const deleted = await this.repo._delete(userId, data);
		const urls = existing.assets.map((asset) => asset.url);
		const allAssetsDeleted = await this.removeAssets(urls);

		if (!allAssetsDeleted) {
			console.warn(
				`Failed to delete one or more review assets for review ${data.id}`,
			);
		}

		await this.cache.namespace('reviews-ratings').delete({
			key: deleted.placeId,
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
			key: data.id,
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

	private async uploadFiles(files: File[]): Promise<string[]> {
		const urls: string[] = [];
		const filetypes = await this.getFileTypes(files);

		for (let i = 0; i < files.length; i++) {
			const id = nanoid();
			const file = files[i]!;
			const filetype = filetypes[i]!;
			const filename = `${id}.${filetype.ext}`;

			try {
				await this.storage
					.use('reviews')
					.put(filename, Buffer.from(await file.arrayBuffer()), {
						contentType: filetype.mime,
					});

				const url = await this.storage.use('reviews').getUrl(filename);
				urls.push(url);
			} catch (_err) {
				// Cleanup any files that were uploaded before the error occurred
				await this.removeAssets(urls);

				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to upload review files',
				});
			}
		}

		return urls;
	}

	private async getFileTypes(files: File[]): Promise<FileTypeResult[]> {
		const results = await Promise.allSettled(
			files.map((file) => this.getFileType(file)),
		);

		const filetypes: FileTypeResult[] = [];

		for (const result of results) {
			if (result.status === 'fulfilled') {
				filetypes.push(result.value);
			} else {
				throw new ORPCError('UNPROCESSABLE_CONTENT', {
					message: 'One or more files have an unsupported file type',
				});
			}
		}

		return filetypes;
	}

	private async getFileType(file: File): Promise<FileTypeResult> {
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

		return t;
	}

	private async removeAssets(urls: string[]): Promise<boolean> {
		let allDeleted = true;

		for (const url of urls) {
			const filename = getFilenameFromUrl(url);

			try {
				await this.storage.use('reviews').delete(filename);
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
}
