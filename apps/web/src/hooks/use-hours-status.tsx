import { TZDate } from '@date-fns/tz';
import { differenceInMinutes, isAfter, isBefore } from 'date-fns';

export type HoursStatus = 'open' | 'closingSoon' | 'openingSoon' | 'closed';

export type HoursInterval = {
	off: boolean;
	open: string;
	close: string;
};

export function useHoursStatus(
	tz: string,
	intervals: HoursInterval[],
): HoursStatus {
	const now = new TZDate(new Date(), tz);

	if (intervals.length === 0) {
		return 'closed';
	}

	const sortedIntervals = intervals.sort((a, b) => {
		const aOpen = constructTZDateWithTime(now, a.open, tz);
		const bOpen = constructTZDateWithTime(now, b.open, tz);
		return aOpen.getTime() - bOpen.getTime();
	});

	for (const interval of sortedIntervals) {
		const o = constructTZDateWithTime(now, interval.open, tz);
		const c = constructTZDateWithTime(now, interval.close, tz);

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

function extractDateString(date: TZDate): string {
	return date.toISOString().split('T')[0];
}

function constructTZDateWithTime(
	date: TZDate,
	time: string,
	tz: string,
): TZDate {
	const dateString = extractDateString(date);
	return new TZDate(`${dateString}T${time}:00Z`, tz);
}
