import { Tokens } from '@wanderlust/common';
import type { Assets } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class AssetsRepository {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	async createAsPending(v: {
		userId: string;
		filename: string;
		data: Assets.dto.CreateInput;
		info: Bun.Image.Metadata;
		blurhash: string;
		size: number;
	}) {
		const pending = {
			url: '',
			bucket: 'reviews',
		};

		const [asset] = await this.db
			.insert(schema.assets)
			.values({
				url: pending.url,
				bucket: pending.bucket,
				key: v.filename,
				mimeType: 'image/webp',
				size: v.size,
				alt: v.data.asset.alt ?? null,
				width: v.info.width,
				height: v.info.height,
				blurhash: v.blurhash,
				status: 'pending',
				visibility: 'private',
				attributions: v.data.asset.attributions,
				uploadedBy: v.userId,
				metadata: null,
			})
			.returning();

		invariant(asset, 'INTERNAL_SERVER_ERROR', 'Failed to create asset');

		return {
			asset: {
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			},
		};
	}

	async createManyAsPending(
		v: {
			userId: string;
			filename: string;
			data: Assets.dto.CreateInput;
			info: Bun.Image.Metadata;
			blurhash: string;
			size: number;
		}[],
	) {
		const pending = {
			url: '',
			bucket: 'reviews',
		};

		const assets = await this.db
			.insert(schema.assets)
			.values(
				v.map((item) => ({
					url: pending.url,
					bucket: pending.bucket,
					key: item.filename,
					mimeType: 'image/webp',
					size: item.size,
					alt: item.data.asset.alt ?? null,
					width: item.info.width,
					height: item.info.height,
					blurhash: item.blurhash,
					status: 'pending' as const,
					visibility: 'private' as const,
					attributions: item.data.asset.attributions,
					uploadedBy: item.userId,
					metadata: null,
				})),
			)
			.returning();

		invariant(
			assets.length === v.length,
			'INTERNAL_SERVER_ERROR',
			'Failed to create assets',
		);

		return {
			assets: assets.map((asset) => ({
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			})),
		};
	}

	async updatePending(v: { id: string; url: string }) {
		const [asset] = await this.db
			.update(schema.assets)
			.set({
				url: v.url,
				status: 'ready',
				visibility: 'public',
			})
			.where(
				and(eq(schema.assets.id, v.id), eq(schema.assets.status, 'pending')),
			)
			.returning();

		invariant(asset, 'INTERNAL_SERVER_ERROR', 'Failed to update asset');

		return {
			asset: {
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			},
		};
	}

	async updateManyPending(v: { id: string; url: string }[]) {
		const assets = await this.db.transaction(async (tx) => {
			for (const item of v) {
				await tx
					.update(schema.assets)
					.set({
						url: item.url,
						status: 'ready',
						visibility: 'public',
					})
					.where(
						and(
							eq(schema.assets.id, item.id),
							eq(schema.assets.status, 'pending'),
						),
					);
			}

			const updatedAssets = await tx.query.assets.findMany({
				where: {
					status: 'ready',
					id: {
						in: v.map((item) => item.id),
					},
				},
			});

			return updatedAssets;
		});

		return {
			assets: assets.map((asset) => ({
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			})),
		};
	}

	async deletePending(id: string) {
		const [asset] = await this.db
			.delete(schema.assets)
			.where(and(eq(schema.assets.id, id), eq(schema.assets.status, 'pending')))
			.returning();

		invariant(asset, 'INTERNAL_SERVER_ERROR', 'Failed to delete asset');

		return {
			asset: {
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			},
		};
	}
}
