import { inspect } from 'node:util';
import { createStream } from 'rotating-file-stream';

const errorLog = createStream('errors.log', {
	size: '10M', // Rotate every 10 MB
	interval: '7d', // Rotate every 7 days
});

export const devErrorLogger = async (error: unknown) => {
	if (process.env.NODE_ENV === 'development') {
		const entry = {
			timestamp: new Date().toISOString(),
			error,
		};

		const formatted = inspect(entry, {
			depth: Number.POSITIVE_INFINITY,
			breakLength: 120,
			compact: false,
		});

		errorLog.write(`${formatted}\n----\n`);
	}
};
