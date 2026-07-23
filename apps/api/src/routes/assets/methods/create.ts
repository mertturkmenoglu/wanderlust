import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Tokens } from '@wanderlust/common';
import type { Assets } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import type { StorageService } from '@wanderlust/storage';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { transformFile } from '../shared/file-transformation';
import { getFileType } from '../shared/file-type';
import { os } from '../shared/router';

@injectable()
export class CreateAssetMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(Tokens.Storage) private readonly storage: StorageService,
	) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Assets.dto.CreateInput,
	): Promise<Assets.dto.CreateOutput> {
		const span = trace.getActiveSpan();

		const filetype = await getFileType(data.asset.file);
		const filename = `${crypto.randomUUID()}.webp`;
		const transformed = await transformFile(data.asset.file);
		const size = transformed.buffer.byteLength;

		span?.addEvent('asset.create.start', {
			originalMime: filetype.mime,
			generatedFilename: filename,
			size,
		});

		let createdAssetId: string | null = null;

		try {
			const [pendingAsset] = await this.db
				.insert(schema.assets)
				.values({
					url: '', // will be updated after upload
					bucket: 'reviews',
					key: filename,
					mimeType: 'image/webp',
					size: size,
					alt: data.asset.alt ?? null,
					width: transformed.meta.width,
					height: transformed.meta.height,
					blurhash: transformed.blur,
					status: 'pending',
					visibility: 'private',
					attributions: data.asset.attributions,
					uploadedBy: userId,
					metadata: null,
				})
				.returning();

			invariant(
				pendingAsset,
				'INTERNAL_SERVER_ERROR',
				'Failed to create asset',
			);

			createdAssetId = pendingAsset.id;

			span?.addEvent('asset.create.created-as-pending', {
				assetId: pendingAsset.id,
				assetStatus: pendingAsset.status,
				assetVisibility: pendingAsset.visibility,
			});

			await this.storage.use('reviews').put(filename, transformed.buffer, {
				contentType: 'image/webp',
			});

			span?.addEvent('asset.create.uploaded-to-storage', new Date());

			const url = await this.storage.use('reviews').getUrl(filename);

			span?.addEvent('asset.create.generated-url', {
				url,
			});

			const [updated] = await await this.db
				.update(schema.assets)
				.set({
					url: url,
					status: 'ready',
					visibility: 'public',
				})
				.where(
					and(
						eq(schema.assets.id, pendingAsset.id),
						eq(schema.assets.status, 'pending'),
					),
				)
				.returning();

			invariant(updated, 'INTERNAL_SERVER_ERROR', 'Failed to update asset');

			span?.addEvent('asset.create.updated-to-ready', {
				assetId: updated.id,
				assetStatus: updated.status,
				assetVisibility: updated.visibility,
				url: updated.url,
			});

			return {
				asset: updated,
			};
		} catch (err) {
			span?.recordException(err as Error);
			span?.setStatus({
				code: SpanStatusCode.ERROR,
				message: (err as Error).message,
			});

			await this.tryToRecoverFromUploadFailure({
				assetId: createdAssetId,
				filename,
				userId,
			});

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
