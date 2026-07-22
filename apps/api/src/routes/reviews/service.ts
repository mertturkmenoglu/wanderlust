/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { trace } from '@opentelemetry/api';
import { ORPCError } from '@orpc/server';
import { CacheService, type TCacheService } from '@wanderlust/cache';
import type { Reviews } from '@wanderlust/contract';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { extractAllFacets } from '@wanderlust/richtext';
import { nanoid } from '@wanderlust/uid';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { detectLanguage, LangCodeFormats } from '@/lib/lang';
import { ReviewsRepository } from './repository';

@injectable()
export class ReviewsService {
	private readonly cache: TCacheService;
	private readonly jobs: TJobsService;
	private readonly ns = 'reviews';

	constructor(
		@inject(ReviewsRepository) private readonly repo: ReviewsRepository,
		@inject(CacheService) cache: CacheService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
		@inject(JobsService) jobs: JobsService,
	) {
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

		try {
			const detectedLanguage = this.getDetectedLanguage(data.content);
			const facets = extractAllFacets(data.content);

			const [insertResult, place] = await this.repo.create(userId, {
				...data,
				detectedLanguage,
				facets,
			});

			await this.invalidatePlaceRatings(data.placeId);

			if ((data.files?.length ?? 0) > 0) {
				await this.invalidatePlaceAssets(data.placeId);
			}

			await this.addCreateReviewActivityForUser({
				username,
				reviewId: insertResult.id,
				placeId: place.id,
				placeName: place.name,
			});

			const mentionedUsernames = facets
				.filter((facet) => facet.type === 'mention')
				.map((facet) => facet.value.slice(1) /* remove the @ */);

			await this.sendMentionNotifications({
				mentionedUsernames,
				reviewId: insertResult.id,
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
			});

			return {
				review: insertResult,
			};
		} catch (err) {
			span?.recordException(err as Error);

			// const allDeleted = await this.removeAssets(urls);

			// span?.addEvent(
			// 	'review.create.cleanup',
			// 	{
			// 		'assets.allDeleted': allDeleted,
			// 		'assets.urls': urls.join(','),
			// 	},
			// 	new Date(),
			// );

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create review',
			});
		}
	}

	async _delete(userId: string, data: Reviews.dto.DeleteInput): Promise<void> {
		// const span = trace.getActiveSpan();

		const existing = await this.repo.get(data);

		if (existing.userId !== userId) {
			throw new ORPCError('FORBIDDEN', {
				message: 'You are not authorized to delete this review',
			});
		}

		const deleted = await this.repo._delete(userId, data);
		// const urls = existing.assets.map((asset) => asset.url);
		// const allAssetsDeleted = await this.removeAssets(urls);

		// if (!allAssetsDeleted) {
		// 	span?.addEvent(
		// 		'review.delete.asset-delete-failure',
		// 		{
		// 			reviewId: data.id,
		// 			urls: urls.join(','),
		// 		},
		// 		new Date(),
		// 	);
		// }

		await this.invalidatePlaceRatings(deleted.placeId);

		// if (urls.length > 0) {
		// 	await this.invalidatePlaceAssets(deleted.placeId);
		// }
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
		const result = await this.repo.listByPlaceId(data);

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
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `places:${data.id}:ratings`,
			ttl: '30m',
			factory: async () => this.repo.getRatings(data),
		});

		return result;
	}

	async listAssetsByPlaceId(
		data: Reviews.dto.ListAssetsByPlaceIdInput,
	): Promise<Reviews.dto.ListAssetsByPlaceIdOutput> {
		const result = await this.cache.namespace(this.ns).getOrSet({
			key: `places:${data.id}:assets`,
			ttl: '30m',
			factory: async () => this.repo.listAssetsByPlaceId(data),
		});

		return result;
	}

	async like(
		userId: string,
		data: Reviews.dto.LikeInput,
	): Promise<Reviews.dto.LikeOutput> {
		const result = await this.repo.like(userId, data);

		if (result.liked) {
			await this.addLikeReviewActivityForUser({
				username: result.thisUser.username,
				reviewId: data.id,
				reviewUser: result.user,
				place: result.place,
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

	private getDetectedLanguage(text: string): string | null {
		const span = trace.getActiveSpan();

		const detectedLanguage = detectLanguage(text, {
			outputFormat: LangCodeFormats.TwoLetter,
		});

		span?.addEvent(
			'review.language.detected',
			{
				'language.detected': detectedLanguage ?? 'unknown',
			},
			new Date(),
		);

		return detectedLanguage;
	}

	private async invalidatePlaceRatings(placeId: string): Promise<void> {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.ratings.invalidate',
			{
				'place.id': placeId,
			},
			new Date(),
		);

		await this.cache.namespace(this.ns).delete({
			key: `places:${placeId}:ratings`,
		});
	}

	private async invalidatePlaceAssets(placeId: string): Promise<void> {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.assets.invalidate',
			{
				'place.id': placeId,
			},
			new Date(),
		);

		await this.cache.namespace(this.ns).delete({
			key: `places:${placeId}:assets`,
		});
	}

	private async addCreateReviewActivityForUser(data: {
		username: string;
		reviewId: string;
		placeId: string;
		placeName: string;
	}) {
		const span = trace.getActiveSpan();

		await this.activities.addActivity(data.username, 'create_review', {
			review: {
				id: data.reviewId,
				place: {
					id: data.placeId,
					name: data.placeName,
				},
			},
		});

		span?.addEvent(
			'review.create.review-activity-added',
			{
				username: data.username,
				'review.id': data.reviewId,
				'place.id': data.placeId,
				'place.name': data.placeName,
			},
			new Date(),
		);
	}

	private async sendMentionNotifications(data: {
		mentionedUsernames: string[];
		reviewId: string;
		place: {
			id: string;
			name: string;
		};
		user: {
			id: string;
			name: string;
			username: string;
			image: string | null;
		};
	}) {
		const span = trace.getActiveSpan();

		const mentionedUsers = await this.repo.getUsersByUsernames(
			data.mentionedUsernames,
		);

		span?.addEvent(
			'review.create.mentioned-users',
			{
				mentionedUsernames: data.mentionedUsernames.join(','),
			},
			new Date(),
		);

		await this.jobs.notification.queue.addBulk(
			mentionedUsers.map((u) => ({
				name: 'create-notification',
				data: {
					id: nanoid(),
					entityId: data.reviewId,
					entityType: 'review',
					type: 'mention',
					recipientId: u.id,
					data: {
						review: {
							id: data.reviewId,
							place: {
								id: data.place.id,
								name: data.place.name,
							},
							user: {
								id: data.user.id,
								name: data.user.name,
								username: data.user.username,
								image: data.user.image,
							},
						},
					},
				},
			})),
		);
	}

	private async addLikeReviewActivityForUser(data: {
		username: string;
		reviewId: string;
		reviewUser: {
			id: string;
			name: string;
			username: string;
			image: string | null;
		};
		place: {
			id: string;
			name: string;
		};
	}) {
		const span = trace.getActiveSpan();

		try {
			await this.activities.addActivity(data.username, 'like_review', {
				review: {
					id: data.reviewId,
					user: {
						id: data.reviewUser.id,
						name: data.reviewUser.name,
						username: data.reviewUser.username,
						image: data.reviewUser.image,
					},
					place: {
						id: data.place.id,
						name: data.place.name,
					},
				},
			});
		} catch (err) {
			span?.recordException(err as Error);
		}
	}
}
