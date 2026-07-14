import { TZDate } from '@date-fns/tz';
import { differenceInMinutes, isAfter, isBefore } from 'date-fns';

export type HoursStatus = 'open' | 'closingSoon' | 'openingSoon' | 'closed';

export function useHoursStatus(
	tz: string,
	intervals: {
		off: boolean;
		open: string;
		close: string;
	}[],
): HoursStatus {
	const now = new TZDate(new Date(), tz);

	if (intervals.length === 0) {
		return 'closed';
	}

	for (const interval of intervals) {
		const o = new TZDate(interval.open, tz);
		const c = new TZDate(interval.close, tz);

		if (isAfter(now, o) && isBefore(now, c)) {
			if (interval.off) {
				return 'closed';
			}

			const isClosingSoon = differenceInMinutes(c, now) <= 60;
			return isClosingSoon ? 'closingSoon' : 'open';
		}

		if (isBefore(now, o)) {
			const isOpeningSoon = differenceInMinutes(o, now) <= 60;
			return isOpeningSoon ? 'openingSoon' : 'closed';
		}
	}

	return 'closed';
}
