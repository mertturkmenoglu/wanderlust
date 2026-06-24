export const defaultFormatStr = "PP K:mm a";

export const selectableHours = [
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'10',
	'11',
	'12',
];

export const selectableMinutes = ['00', '15', '30', '45'];

export const numericRegex = /^[0-9]{1,2}$/;

export function padNumber(num: number, length = 2): string {
	return num.toString().padStart(length, '0');
}
