import crypto from 'node:crypto';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Tokens } from '@wanderlust/common';
import type { Assets } from '@wanderlust/contract';
import type { StorageService } from '@wanderlust/storage';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { calculateBlurhash } from '@/lib/blurhash';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { zip } from '@/lib/zip';
import { AssetsRepository } from './repository';

@injectable()
@TraceAll()
export class AssetsService {
	constructor(
		@inject(AssetsRepository)
		private readonly repo: AssetsRepository,
		@inject(Tokens.Storage)
		private readonly storage: StorageService,
	) {}

	async create(
		userId: string,
		data: Assets.dto.CreateInput,
	): Promise<Assets.dto.CreateOutput> {
		const span = trace.getActiveSpan();

		const filetype = await this.getFileType(data.asset.file);
		const filename = `${crypto.randomUUID()}.webp`;
		const transformed = await this.transformFile(data.asset.file);
		const size = transformed.buffer.byteLength;

		span?.addEvent('asset.create.start', {
			originalMime: filetype.mime,
			generatedFilename: filename,
			size,
		});

		let createdAssetId: string | null = null;

		try {
			const pendingAsset = await this.repo.createAsPending({
				userId,
				filename,
				data,
				info: transformed.meta,
				blurhash: transformed.blur,
				size,
			});

			createdAssetId = pendingAsset.asset.id;

			span?.addEvent('asset.create.created-as-pending', {
				assetId: pendingAsset.asset.id,
				assetStatus: pendingAsset.asset.status,
				assetVisibility: pendingAsset.asset.visibility,
			});

			await this.storage.use('reviews').put(filename, transformed.buffer, {
				contentType: 'image/webp',
			});

			span?.addEvent('asset.create.uploaded-to-storage', new Date());

			const url = await this.storage.use('reviews').getUrl(filename);

			span?.addEvent('asset.create.generated-url', {
				url,
			});

			const updated = await this.repo.updatePending({
				id: pendingAsset.asset.id,
				url,
			});

			span?.addEvent('asset.create.updated-to-ready', {
				assetId: updated.asset.id,
				assetStatus: updated.asset.status,
				assetVisibility: updated.asset.visibility,
				url: updated.asset.url,
			});

			return updated;
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

	async createMany(
		userId: string,
		data: Assets.dto.CreateManyInput,
	): Promise<Assets.dto.CreateManyOutput> {
		const span = trace.getActiveSpan();

		const filetypes = await Promise.all(
			data.assets.map((asset) => this.getFileType(asset.file)),
		);

		const filenames = data.assets.map(() => `${crypto.randomUUID()}.webp`);

		const transformed = await Promise.all(
			data.assets.map((asset) => this.transformFile(asset.file)),
		);

		const sizes = transformed.map((t) => t.buffer.byteLength);

		span?.addEvent('asset.create-many.start', {
			originalMimes: filetypes.map((f) => f.mime),
			generatedFilenames: filenames,
			sizes,
		});

		const createdAssetIds: (string | null)[] = [];

		try {
			const pendingAssets = await this.repo.createManyAsPending(
				data.assets.map((asset, i) => ({
					userId,
					filename: filenames[i]!,
					data: { asset },
					info: transformed[i]!.meta,
					blurhash: transformed[i]!.blur,
					size: sizes[i]!,
				})),
			);

			const pendingAssetsSorted: Assets.dto.CreateManyOutput['assets'][number][] =
				[];

			for (const filename of filenames) {
				const asset = pendingAssets.assets.find((a) => a.key === filename);

				invariant(
					asset,
					'INTERNAL_SERVER_ERROR',
					`Failed to find pending asset for filename ${filename}`,
				);

				pendingAssetsSorted.push(asset);
			}

			createdAssetIds.push(...pendingAssetsSorted.map((a) => a.id));

			span?.addEvent('asset.create-many.created-as-pending', {
				assetIds: pendingAssets.assets.map((a) => a.id),
				assetStatuses: pendingAssets.assets.map((a) => a.status),
				assetVisibilities: pendingAssets.assets.map((a) => a.visibility),
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

			const updated = await this.repo.updateManyPending(
				pendingAssetsSorted.map((asset, i) => ({
					id: asset.id,
					url: urls[i]!,
				})),
			);

			return updated;
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

	private async getFileType(file: File): Promise<FileTypeResult> {
		const t = await fileTypeFromBlob(file);

		invariant(t, 'UNPROCESSABLE_CONTENT', 'Could not determine file type');

		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

		invariant(
			allowedMimeTypes.includes(t.mime),
			'UNPROCESSABLE_CONTENT',
			`File type ${t.mime} is not allowed`,
		);

		return t;
	}

	private async transformFile(file: File): Promise<{
		buffer: Buffer<ArrayBufferLike>;
		meta: Bun.Image.Metadata;
		blur: string;
	}> {
		const out = file
			.image({
				autoOrient: true,
			})
			.resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 });
		const meta = await out.metadata();
		const buffer = await out.toBuffer();
		const blur = await calculateBlurhash(file);

		return {
			buffer,
			meta,
			blur,
		};
	}

	private async tryToRecoverFromUploadFailure(data: {
		userId: string;
		filename: string;
		assetId: string | null;
	}) {
		const span = trace.getActiveSpan();

		try {
			if (data.assetId !== null) {
				await this.repo.deletePending(data.assetId);
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
