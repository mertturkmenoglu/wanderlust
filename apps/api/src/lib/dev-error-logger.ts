import { createWriteStream } from 'node:fs';
import { inspect } from 'node:util';

const errorLog = createWriteStream('errors.log', { flags: 'a' });

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
}
