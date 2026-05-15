// https://stackoverflow.com/a/14919494
/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = false, dp = 1) {
	let bbytes = bytes;

	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return `${bbytes} B`;
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bbytes /= thresh;
		++u;
	} while (
		Math.round(Math.abs(bbytes) * r) / r >= thresh &&
		u < units.length - 1
	);

	return `${bbytes.toFixed(dp)} ${units[u]}`;
}
