import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';
import { toast } from 'sonner';

function useUpload() {
	const service = useMachine(fileUpload.machine, {
		id: useId(),
		accept: ['image/jpeg', 'image/png'],
		maxFiles: 4,
		maxFileSize: 1024 * 1024 * 10, // 5MB
	});

	return fileUpload.connect(service, normalizeProps);
}

export type UseUpload = ReturnType<typeof useUpload>;

function usePreviews(up: UseUpload) {
	return up.acceptedFiles.map((file) => URL.createObjectURL(file));
}

type Ext = 'jpg' | 'jpeg' | 'png';

function checkExtensions(
	extensions: (string | undefined)[],
): extensions is Ext[] {
	for (const ext of extensions) {
		if (!ext) {
			toast.error('Invalid file type');
			return false;
		}

		if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
			toast.error('Invalid file type');
			return false;
		}
	}

	return true;
}

export { checkExtensions, usePreviews, useUpload };
