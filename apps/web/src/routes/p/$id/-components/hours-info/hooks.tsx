import { TZDate } from '@date-fns/tz';
import { mapping } from './utils';

export function useMustGetToday(
	tz: string,
	hours: {
		day: string;
		open: Date;
		close: Date;
	}[],
) {
	const key = mapping[new TZDate(new Date(), tz).getUTCDay()];
	const today = hours.find((h) => h.day === key);

	if (!today) {
		throw new Error('Today hours not found');
	}

	return today;
}
