import crypto from 'node:crypto';
import type { Assets } from '@wanderlust/contract';
import { StorageService, type TStorageService } from '@wanderlust/storage';
import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { inject, injectable } from 'inversify';
import { calculateBlurhash } from '@/lib/blurhash';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import { AssetsRepository } from './repository';

@injectable()
@TraceAll()
export class AssetsService {
	private readonly storage: TStorageService;

	constructor(
		@inject(AssetsRepository)
		private readonly repo: AssetsRepository,
		@inject(StorageService)
		storage: StorageService,
	) {
		this.storage = storage.get();
	}

	async create(
		userId: string,
		data: Assets.dto.CreateInput,
	): Promise<Assets.dto.CreateOutput> {
		const filetype = await this.getFileType(data.asset.file);
		const uuid = crypto.randomUUID();
		const filename = `${uuid}.${filetype.ext}`;
		const transformed = await this.transformFile(data.asset.file);
		const size = transformed.buffer.byteLength;
		await this.storage.use('reviews').put(filename, transformed.buffer, {
			contentType: filetype.mime,
		});
		const url = await this.storage.use('reviews').getUrl(filename);

		const result = await this.repo.create({
			blurhash: transformed.blur,
			info: transformed.meta,
			data,
			filename,
			size,
			url,
			userId,
		});

		return result;
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
}
