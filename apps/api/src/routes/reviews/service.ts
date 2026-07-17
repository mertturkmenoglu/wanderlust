/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { trace } from '@opentelemetry/api';
import { ORPCError } from '@orpc/server';
import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Reviews } from '@wanderlust/contract';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { createLinkifyInstance } from '@wanderlust/richtext';
import {
	getFilenameFromUrl,
	StorageService,
	type TStorageService,
} from '@wanderlust/storage';
import { nanoid } from '@wanderlust/uid';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { detectLanguage, LangCodeFormats } from '@/lib/lang';
import { TraceAll } from '@/lib/tracer';
import { ReviewsRepository } from './repository';

@injectable()
@TraceAll()
export class ReviewsService {
	private readonly storage: TStorageService;
	private readonly cache: TCacheService;
	private readonly jobs: TJobsService;
	private readonly linkify = createLinkifyInstance();

	constructor(
		@inject(ReviewsRepository) private readonly repo: ReviewsRepository,
		@inject(StorageService) storage: StorageService,
		@inject(CacheService) cache: CacheService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
		@inject(JobsService) jobs: JobsService,
	) {
		this.storage = storage.get();
		this.cache = cache.get();
		this.jobs = jobs.get();
	}

	async get(
		userId: string | null,
		data: Reviews.dto.GetInput,
	): Promise<Reviews.dto.GetOutput> {
		const result = await this.repo.get(data);

		const likes = await this.repo.getLikedStatuses(userId, [result.id]);

		return {
			review: result,
			meta: {
				isLiked: likes.includes(result.id),
			},
		};
	}

	async create(
		userId: string,
		username: string,
		data: Reviews.dto.CreateInput,
	): Promise<Reviews.dto.CreateOutput> {
		const span = trace.getActiveSpan();

		const files = data.files || [];
		const urls = await this.uploadFiles(files);

		span?.addEvent(
			'review.files',
			{
				count: files.length,
				urls: urls.join(','),
			},
			new Date(),
		);

		try {
			const detectedLanguage = detectLanguage(data.content, {
				outputFormat: LangCodeFormats.TwoLetter,
			});

			span?.addEvent(
				'review.language.detected',
				{
					'language.detected': detectedLanguage ?? 'unknown',
				},
				new Date(),
			);

			const facets = this.linkify.find(data.content);

			span?.addEvent(
				'review.facets',
				{
					facets: JSON.stringify(facets),
				},
				new Date(),
			);

			const [insertResult, place] = await this.repo.create(userId, {
				...data,
				detectedLanguage,
				urls,
				facets,
			});

			span?.addEvent(
				'review.create',
				{
					'review.id': insertResult.id,
					'review.place.id': place.id,
					'review.place.name': place.name,
				},
				new Date(),
			);

			await this.cache.namespace('reviews-ratings').delete({
				key: data.placeId,
			});

			span?.addEvent(
				'review.create.place-ratings-cache-cleared',
				{
					'place.id': place.id,
					'place.name': place.name,
				},
				new Date(),
			);

			await this.activities.addActivity(username, 'create_review', {
				review: {
					id: insertResult.id,
					place: {
						id: place.id,
						name: place.name,
					},
				},
			});

			span?.addEvent(
				'review.create.review-activity-added',
				{
					username: username,
					'review.id': insertResult.id,
					'place.id': place.id,
					'place.name': place.name,
				},
				new Date(),
			);

			const mentionFacets = facets.filter((facet) => facet.type === 'mention');

			const mentionedUsernames = mentionFacets.map((facet) =>
				facet.value.slice(1),
			);

			const mentionedUsers =
				await this.repo.getUsersByUsernames(mentionedUsernames);

			span?.addEvent(
				'review.create.mentioned-users',
				{
					mentionedUsernames: mentionedUsernames.join(','),
				},
				new Date(),
			);

			await this.jobs.notification.queue.addBulk(
				mentionedUsers.map((u) => ({
					name: 'create-notification',
					data: {
						id: nanoid(),
						entityId: insertResult.id,
						entityType: 'review',
						type: 'mention',
						recipientId: u.id,
						data: {
							review: {
								id: insertResult.id,
								place: {
									id: place.id,
									name: place.name,
								},
								user: {
									id: userId,
									name: insertResult.user.name,
									username: username,
									image: insertResult.user.image,
								},
							},
						},
					},
				})),
			);

			return {
				review: insertResult,
			};
		} catch (err) {
			span?.recordException(err as Error);
			span?.addEvent(
				'review.create.error',
				{
					message: (err as Error).message,
				},
				new Date(),
			);

			const allDeleted = await this.removeAssets(urls);

			span?.addEvent(
				'review.create.cleanup',
				{
					'assets.allDeleted': allDeleted,
					'assets.urls': urls.join(','),
				},
				new Date(),
			);

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create review',
			});
		}
	}

	async _delete(userId: string, data: Reviews.dto.DeleteInput): Promise<void> {
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
		userId: string | null,
		data: Reviews.dto.ListByUsernameInput,
	): Promise<Reviews.dto.ListByUsernameOutput> {
		const result = await this.repo.listByUsername(data);

		const likes = await this.repo.getLikedStatuses(
			userId,
			result.reviews.map((r) => r.id),
		);

		return {
			reviews: result.reviews.map((review) => ({
				review: review,
				meta: {
					isLiked: likes.includes(review.id),
				},
			})),
			pagination: result.pagination,
		};
	}

	async listByPlaceId(
		userId: string | null,
		data: Reviews.dto.ListByPlaceIdInput,
	): Promise<Reviews.dto.ListByPlaceIdOutput> {
		const result = await this.cache.namespace('reviews').getOrSet({
			key: `places:${data.id}:page:${data.page}:pageSize:${data.pageSize}:sort:${data.sortBy}:order:${data.sortOrd}:min:${data.minRating}:max:${data.maxRating}`,
			ttl: '10m',
			factory: async () => this.repo.listByPlaceId(data),
			grace: '1m',
		});

		const likes = await this.repo.getLikedStatuses(
			userId,
			result.reviews.map((r) => r.id),
		);

		return {
			reviews: result.reviews.map((review) => ({
				review: review,
				meta: {
					isLiked: likes.includes(review.id),
				},
			})),
			pagination: result.pagination,
		};
	}

	async getRatings(
		data: Reviews.dto.GetRatingsInput,
	): Promise<Reviews.dto.GetRatingsOutput> {
		const result = await this.cache.namespace('reviews-ratings').getOrSet({
			key: data.id,
			ttl: '30m',
			factory: async () => this.repo.getRatings(data),
		});

		return result;
	}

	async listAssetsByPlaceId(
		data: Reviews.dto.ListAssetsByPlaceIdInput,
	): Promise<Reviews.dto.ListAssetsByPlaceIdOutput> {
		const result = await this.repo.listAssetsByPlaceId(data);

		return result;
	}

	async like(
		userId: string,
		data: Reviews.dto.LikeInput,
	): Promise<Reviews.dto.LikeOutput> {
		const result = await this.repo.like(userId, data);

		try {
			if (result.liked) {
				await this.activities.addActivity(
					result.thisUser.username,
					'like_review',
					{
						review: {
							id: data.id,
							user: {
								id: result.user.id,
								name: result.user.name,
								username: result.user.username,
								image: result.user.image,
							},
							place: {
								id: result.place.id,
								name: result.place.name,
							},
						},
					},
				);
			}
		} catch {
			console.error('Failed to add like activity for review', {
				reviewId: data.id,
				userId,
			});
		}

		return {
			liked: result.liked,
		};
	}

	async listLikes(
		userId: string,
		data: Reviews.dto.ListLikesInput,
	): Promise<Reviews.dto.ListLikesOutput> {
		const result = await this.repo.listLikes(userId, data);

		return {
			users: result.users,
			pagination: result.pagination,
		};
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
