// compression-polyfill.ts
/**
 * This is a polyfill for the CompressionStream.
 * This solves the issue where Drizzle Studio Can't find variable: CompressionStream
 *
 * ![BUG]: ReferenceError: Can't find variable: CompressionStream
 * @see https://github.com/drizzle-team/drizzle-orm/issues/3880
 *
 * Bun doesn't have CompressionStream yet
 * @see https://github.com/oven-sh/bun/issues/1723
 */

// import zlib from 'node:zlib';

// const transformMap = {
// 	deflate: zlib.createDeflate,
// 	'deflate-raw': zlib.createDeflateRaw,
// 	gzip: zlib.createGzip,
// };

// globalThis.CompressionStream ??= class CompressionStream {
// 	readable;
// 	writable;
// 	constructor(format: 'deflate' | 'deflate-raw' | 'gzip') {
// 		const handle = transformMap[format]();
// 		this.readable = Readable.toWeb(handle);
// 		this.writable = Writable.toWeb(handle);
// 	}
// };
