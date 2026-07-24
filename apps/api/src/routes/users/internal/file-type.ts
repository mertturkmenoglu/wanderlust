import { type FileTypeResult, fileTypeFromBlob } from 'file-type';
import { invariant } from '@/lib/invariant';

export async function getFileType(file: File): Promise<FileTypeResult> {
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
