import { TZDate } from '@date-fns/tz';
import type { TOpeningHours } from './types';
import { mapping } from './utils';

export function useMustGetToday(tz: string, hours: TOpeningHours) {
	const key = mapping[new TZDate(new Date(), tz).getUTCDay()];
	const today = hours.regular.find((h) => h.day === key);

	if (!today) {
		return {
			day: key,
			intervals: [],
		};
	}

	return today;
}
