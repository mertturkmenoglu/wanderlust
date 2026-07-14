export type TRichTextFacet = {
	type: string;
	value: string;
	start: number;
	end: number;
};

export type TAttribution = {
	type: string;
	text: string;
	link: string;
};

/**
 * Opening hours information for a place.
 *
 * `Regular`: Weekly schedule with each day of the week represented by a 2-letter abbreviation (`mn`, `tu`, `we`, `th`, `fr`, `sa`, `su`)
 * - Each day can have multiple intervals.
 * - If a day has no intervals, it means the place is closed for that day.
 * - If a day has intervals, each interval can have an `off` flag. If `off` is `true`, it means the place is closed for that interval.
 * - If a day has intervals, each interval must have an `open` and `close` time in `ISO 8601` time format (HH:mm).
 *
 * `Special`: Special days can be represented by a rule (e.g. `PH` for public holidays, or a specific date in YYYY-MM-DD format)
 * - Each special day can have multiple intervals, similar to the regular weekly schedule.
 * - If a special day has no intervals, it means the place is closed for that day.
 * - If a special day has intervals, each interval can have an `off` flag. If `off` is `true`, it means the place is closed for that interval.
 * - If a special day has intervals, each interval must have an `open` and `close` time in `ISO 8601` time format (HH:mm).
 *
 * ### Note
 * A place inherits the timezone information from its city. Every city has a timezone (IANA name, e.g. `America/New_York`), and the opening hours are always in the local time of the city where the place is located.
 */
export type TOpeningHours = {
	regular: {
		day: string;
		intervals: {
			off: boolean;
			open: string;
			close: string;
		}[];
	}[];
	special: {
		rule: string;
		intervals: {
			off: boolean;
			open: string;
			close: string;
		}[];
	}[];
};
