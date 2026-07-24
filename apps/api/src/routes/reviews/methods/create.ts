import { trace } from '@opentelemetry/api';
import { ORPCError } from '@orpc/server';
import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { JobsService } from '@wanderlust/jobs';
import { extractAllFacets } from '@wanderlust/richtext';
import { nanoid } from '@wanderlust/uid';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { detectLanguage, LangCodeFormats } from '@/lib/lang';
import { areSetsEqual } from '@/lib/set-equality';
import { requireAuth } from '@/middlewares/authn';
import { os } from '../shared/router';

type CreateReviewParams = Reviews.dto.CreateInput & {
	detectedLanguage: string | null;
	facets: {
		type: string;
		value: string;
		start: number;
		end: number;
	}[];
};

@injectable()
export class CreateReviewMethod {
	private readonly ns = 'reviews';

	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Cache) private readonly cache: CacheService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
		@inject(Tokens.Jobs) private readonly jobs: JobsService,
	) {}

	route() {
		return os.create.use(requireAuth).handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const username = context.session.user.username;
			const result = await this.execute(userId, username, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		username: string,
		data: Reviews.dto.CreateInput,
	): Promise<Reviews.dto.CreateOutput> {
		const span = trace.getActiveSpan();

		try {
			const detectedLanguage = this.getDetectedLanguage(data.content);
			const facets = extractAllFacets(data.content);

			const [insertResult, place] = await this.create(userId, {
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

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create review',
			});
		}
	}

	private async create(userId: string, data: CreateReviewParams) {
		const span = trace.getActiveSpan();

		span?.addEvent(
			'review.create.repository',
			{
				'user.id': userId,
				'place.id': data.placeId,
				'review.rating': data.rating,
				'review.visitedAt': data.visitedAt?.toISOString() || 'unknown',
				'review.detectedLanguage': data.detectedLanguage || 'unknown',
				'review.attachments': JSON.stringify(data.files ?? []),
				'review.facets': JSON.stringify(data.facets),
			},
			new Date(),
		);

		void this.checkAssetsStatusAndPermissions(userId, data.files ?? []);

		const results = await this.db.transaction(async (tx) => {
			const [review] = await tx
				.insert(schema.reviews)
				.values({
					id: nanoid(),
					placeId: data.placeId,
					userId: userId,
					content: data.content,
					facets: data.facets,
					rating: data.rating,
					visitedAt: data.visitedAt,
					detectedLanguage: data.detectedLanguage,
					totalLikes: 0,
				})
				.returning();

			invariant(review, 'INTERNAL_SERVER_ERROR', 'Failed to create review');

			if (data.files && data.files.length > 0) {
				await tx.insert(schema.assetsToReviews).values(
					data.files.map((f, i) => ({
						assetId: f,
						order: i,
						reviewId: review.id,
					})),
				);

				await tx
					.update(schema.assets)
					.set({
						status: 'available',
					})
					.where(dz.inArray(schema.assets.id, data.files));
			}

			await tx
				.update(schema.places)
				.set({
					totalVotes: dz.sql`${schema.places.totalVotes} + 1`,
					totalPoints: dz.sql`${schema.places.totalPoints} + ${data.rating}`,
				})
				.where(dz.eq(schema.places.id, data.placeId));

			const res = await tx.query.reviews.findFirst({
				where: {
					id: review.id,
				},
				with: {
					assets: true,
					user: {
						columns: {
							id: true,
							username: true,
							name: true,
							image: true,
						},
					},
				},
			});

			invariant(
				res,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve created review',
			);

			const place = await tx.query.places.findFirst({
				where: {
					id: review.placeId,
				},
			});

			invariant(place, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve the place');

			return [res, place] as const;
		});

		return results;
	}

	async checkAssetsStatusAndPermissions(userId: string, assetIds: string[]) {
		if (assetIds.length === 0) {
			return;
		}

		const assets = await this.db.query.assets.findMany({
			where: {
				id: {
					in: assetIds,
				},
			},
			columns: {
				id: true,
				uploadedBy: true,
				status: true,
				bucket: true,
			},
		});

		const fetchedAssetIds = assets.map((a) => a.id);
		const ok = areSetsEqual(new Set(fetchedAssetIds), new Set(assetIds));

		if (!ok) {
			throw new ORPCError('CONFLICT', {
				message: 'One or more assets do not exist or are not accessible',
			});
		}

		for (const asset of assets) {
			if (
				asset.uploadedBy !== userId ||
				asset.status !== 'ready' ||
				asset.bucket !== 'reviews'
			) {
				// For security reasons, we don't reveal which asset is not accessible to the user. We just throw a generic error.
				throw new ORPCError('CONFLICT', {
					message: 'One or more assets do not exist or are not accessible',
				});
			}
		}
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

		const mentionedUsers = await this.getUsersByUsernames(
			data.mentionedUsernames,
		);

		span?.addEvent(
			'review.create.mentioned-users',
			{
				mentionedUsernames: data.mentionedUsernames.join(','),
			},
			new Date(),
		);

		await this.jobs.notifications.queue.addBulk(
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

	private async getUsersByUsernames(usernames: string[]) {
		const result = await this.db.query.users.findMany({
			where: {
				username: {
					in: usernames,
				},
			},
			columns: {
				id: true,
				username: true,
				name: true,
				image: true,
			},
		});

		return result;
	}
}
