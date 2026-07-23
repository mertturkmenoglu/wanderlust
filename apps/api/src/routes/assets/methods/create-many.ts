import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Tokens } from '@wanderlust/common';
import type { Assets } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { StorageService } from '@wanderlust/storage';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { zip } from '@/lib/zip';
import { transformFile } from '../shared/file-transformation';
import { getFileType } from '../shared/file-type';
import { os } from '../shared/router';

@injectable()
export class CreateManyAssetsMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Storage) private readonly storage: StorageService,
	) {}

	route() {
		return os.createMany.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Assets.dto.CreateManyInput,
	): Promise<Assets.dto.CreateManyOutput> {
		const span = trace.getActiveSpan();

		const filetypes = await Promise.all(
			data.assets.map((asset) => getFileType(asset.file)),
		);

		const filenames = data.assets.map(() => `${crypto.randomUUID()}.webp`);

		const transformed = await Promise.all(
			data.assets.map((asset) => transformFile(asset.file)),
		);

		const sizes = transformed.map((t) => t.buffer.byteLength);

		span?.addEvent('asset.create-many.start', {
			originalMimes: filetypes.map((f) => f.mime),
			generatedFilenames: filenames,
			sizes,
		});

		const createdAssetIds: (string | null)[] = [];

		try {
			const pendingAssets = await this.db
				.insert(schema.assets)
				.values(
					data.assets.map((item, i) => ({
						url: '', // will be updated after upload
						bucket: 'reviews',
						key: filenames[i]!,
						mimeType: 'image/webp',
						size: sizes[i]!,
						alt: item.alt ?? null,
						width: transformed[i]!.meta.width,
						height: transformed[i]!.meta.height,
						blurhash: transformed[i]!.blur,
						status: 'pending' as const,
						visibility: 'private' as const,
						attributions: item.attributions,
						uploadedBy: userId,
						metadata: null,
					})),
				)
				.returning();

			invariant(
				pendingAssets.length === data.assets.length,
				'INTERNAL_SERVER_ERROR',
				'Failed to create assets',
			);

			const pendingAssetsSorted: Assets.dto.CreateManyOutput['assets'][number][] =
				[];

			for (const filename of filenames) {
				const asset = pendingAssets.find((a) => a.key === filename);

				invariant(
					asset,
					'INTERNAL_SERVER_ERROR',
					`Failed to find pending asset for filename ${filename}`,
				);

				pendingAssetsSorted.push(asset);
			}

			createdAssetIds.push(...pendingAssetsSorted.map((a) => a.id));

			span?.addEvent('asset.create-many.created-as-pending', {
				assetIds: pendingAssets.map((a) => a.id),
				assetStatuses: pendingAssets.map((a) => a.status),
				assetVisibilities: pendingAssets.map((a) => a.visibility),
			});

			await Promise.all(
				zip(filenames, transformed).map(([filename, t]) =>
					this.storage.use('reviews').put(filename, t.buffer, {
						contentType: 'image/webp',
					}),
				),
			);

			const urls = await Promise.all(
				filenames.map((filename) =>
					this.storage.use('reviews').getUrl(filename),
				),
			);

			span?.addEvent('asset.create-many.generated-urls', {
				urls,
			});

			const updated = await this.db.transaction(async (tx) => {
				const v = pendingAssetsSorted.map((asset, i) => ({
					id: asset.id,
					url: urls[i]!,
				}));

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
				assets: updated,
			};
		} catch (err) {
			span?.recordException(err as Error);
			span?.setStatus({
				code: SpanStatusCode.ERROR,
				message: (err as Error).message,
			});

			await Promise.all(
				zip(filenames, createdAssetIds).map(([filename, assetId]) =>
					this.tryToRecoverFromUploadFailure({
						assetId,
						filename,
						userId,
					}),
				),
			);

			throw err;
		}
	}

	private async tryToRecoverFromUploadFailure(data: {
		userId: string;
		filename: string;
		assetId: string | null;
	}) {
		const span = trace.getActiveSpan();

		try {
			if (data.assetId !== null) {
				const [asset] = await this.db
					.delete(schema.assets)
					.where(
						and(
							eq(schema.assets.id, data.assetId),
							eq(schema.assets.status, 'pending'),
						),
					)
					.returning();

				invariant(asset, 'INTERNAL_SERVER_ERROR', 'Failed to delete asset');
			}

			await this.storage.use('reviews').delete(data.filename);
		} catch (innerErr) {
			span?.recordException(innerErr as Error);
			span?.setStatus({
				code: SpanStatusCode.ERROR,
				message: (innerErr as Error).message,
			});
		}
	}
}
