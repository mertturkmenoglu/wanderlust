import { calculateBlurhash } from '@/lib/blurhash';

export type FileTransformationResult = {
	buffer: Buffer<ArrayBufferLike>;
	meta: Bun.Image.Metadata;
	blur: string;
};

export async function transformFile(
	file: File,
): Promise<FileTransformationResult> {
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
