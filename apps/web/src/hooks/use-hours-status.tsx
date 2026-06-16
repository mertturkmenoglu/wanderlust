import { differenceInMinutes, isAfter, isBefore, isEqual } from 'date-fns';

export type HoursStatus = 'open' | 'closingSoon' | 'openingSoon' | 'closed';

export function useHoursStatus(open: Date, close: Date): HoursStatus {
	const now = new Date();
	const isSame = isEqual(open, close);

	const isOpenNow = isAfter(now, open) && isBefore(now, close) && !isSame;

	const isClosingSoon = isOpenNow && differenceInMinutes(close, now) <= 60;

	const isOpeningSoon =
		!isOpenNow && isBefore(now, open) && differenceInMinutes(open, now) <= 60;

	if (isClosingSoon) {
		return 'closingSoon';
	}

	if (isOpenNow) {
		return 'open';
	}

	if (isOpeningSoon) {
		return 'openingSoon';
	}

	return 'closed';
}
