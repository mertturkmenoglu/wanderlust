import { parse } from 'date-fns';

const mapping: Record<number, string> = {
	0: 'sun',
	1: 'mon',
	2: 'tue',
	3: 'wed',
	4: 'thu',
	5: 'fri',
	6: 'sat',
};

function dayToKey(day: string) {
	for (const [key, value] of Object.entries(mapping)) {
		if (value === day) {
			return Number(key);
		}
	}

	return 0;
}

function parseHours(hours: Record<string, string>) {
	const result: { day: string; open: Date; close: Date }[] = [];

	for (const [day, h] of Object.entries(hours)) {
		const parts = h.split('-');
		const openPart = parts[0];
		const closePart = parts[1];

		const open = parse(openPart, 'HH:mm', new Date());
		const close = parse(closePart, 'HH:mm', new Date());

		result.push({
			day,
			open,
			close,
		});
	}

	return result.toSorted((a, b) => dayToKey(a.day) - dayToKey(b.day));
}

export { dayToKey, mapping, parseHours };
