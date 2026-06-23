import { format } from "date-fns";

export const timezoneOffsets = [
	"UTC-11:00",
	"UTC-10:00",
	"UTC-09:30",
	"UTC-09:00",
	"UTC-08:00",
	"UTC-07:00",
	"UTC-06:00",
	"UTC-05:00",
	"UTC-04:00",
	"UTC-03:00",
	"UTC-02:30",
	"UTC-02:00",
	"UTC-01:00",
	"UTC+00:00",
	"UTC+01:00",
	"UTC+02:00",
	"UTC+03:00",
	"UTC+03:30",
	"UTC+04:00",
	"UTC+04:30",
	"UTC+05:00",
	"UTC+05:30",
	"UTC+05:45",
	"UTC+06:00",
	"UTC+06:30",
	"UTC+07:00",
	"UTC+08:00",
	"UTC+08:45",
	"UTC+09:00",
	"UTC+09:30",
	"UTC+10:00",
	"UTC+10:30",
	"UTC+11:00",
	"UTC+12:00",
	"UTC+12:45",
	"UTC+13:00",
	"UTC+14:00",
];

export function getCurrentTimezoneOffset(withUtcPrefix = true) {
	const offset = format(new Date(), "xxx");
	return withUtcPrefix ? `UTC${offset}` : offset;
}

export function stripUTCPrefix(offsetWithUtcPrefix: string) {
	return offsetWithUtcPrefix.replace(/^UTC/, "");
}

export function getCurrentTimezoneIANAName() {
	const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return ianaTimezone;
}
