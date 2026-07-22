import { encode } from 'blurhash';
import { decode } from 'fast-png';

// At this moment, Sharp isn't working well with Bun, so we are using
// Bun's built-in image library. The catch is, its placeholder/blur generation
// is a bit different. It uses Thumbhash instead of Blurhash (which is actually better in some ways),
// but the returned value is not the hash itself, but a base64 encoded image.
// Its >1000 characters long, which is not acceptable in our case.
// So the solution is like this:
// - Continue to use Bun.Image for resizing and other transformations.
// - Create a small PNG from the file.
// - Decode the PNG into RGBA pixel data. (We must decode it to 4 channels)
// - Create a Uint8ClampedArray from the pixel data.
// - Use the Blurhash library to generate a Blurhash from the RGBA pixel data.

/**
 * Calculate the Blurhash of a given image file.
 *
 * This function resizes the image to a maximum of 64x64 pixels, decodes it into RGBA pixel data, and then generates a Blurhash from that data.
 * @param file The image file for which to calculate the Blurhash.
 * @returns A promise that resolves to the Blurhash string.
 */
export async function calculateBlurhash(file: File): Promise<string> {
	const pngBytes = await file
		.image({ autoOrient: true })
		.resize(64, 64, { fit: 'inside' })
		.png()
		.bytes();

	const { width, height, data, channels } = decode(pngBytes);

	// Claude wrote this code, I don't understand what we are doing.
	// Jesus take the wheel.
	const rgba = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < width * height; i++) {
		rgba[i * 4] = data[i * channels] ?? 0;
		rgba[i * 4 + 1] = data[i * channels + 1] ?? data[i * channels] ?? 0;
		rgba[i * 4 + 2] = data[i * channels + 2] ?? data[i * channels] ?? 0;
		rgba[i * 4 + 3] = channels === 4 ? (data[i * channels + 3] ?? 0) : 255;
	}

	const blur = encode(rgba, width, height, 4, 3);

	return blur;
}
