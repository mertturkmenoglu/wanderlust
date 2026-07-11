import { useState } from 'react';
import type { Area, Point } from 'react-easy-crop';

type ImageCropperOptions = {
	initial: {
		preview: string | (() => string);
		crop?: Point | (() => Point);
		zoom?: number | (() => number);
		croppedAreaPixels?: (Area | null) | (() => Area | null);
	};
};

const createImage = (url: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = url;
	});
};

export function useImageCropper(opts: ImageCropperOptions) {
	const [preview, setPreview] = useState(opts.initial.preview);
	const [crop, setCrop] = useState<Point>(opts.initial.crop || { x: 0, y: 0 });
	const [zoom, setZoom] = useState(opts.initial.zoom || 1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
		opts.initial.croppedAreaPixels || null,
	);

	const getCroppedImage = async (): Promise<File | null> => {
		const image = await createImage(preview);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('Failed to get canvas context');
		}

		if (!croppedAreaPixels) {
			return null;
		}

		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;

		ctx.drawImage(
			image,
			croppedAreaPixels.x,
			croppedAreaPixels.y,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				const file = blob
					? new File([blob], 'image.jpg', { type: 'image/jpeg' })
					: null;
				resolve(file);
			}, 'image/jpeg');
		});
	};

	return {
		preview,
		setPreview,
		crop,
		setCrop,
		zoom,
		setZoom,
		croppedAreaPixels,
		setCroppedAreaPixels,
		getCroppedImage,
	};
}
