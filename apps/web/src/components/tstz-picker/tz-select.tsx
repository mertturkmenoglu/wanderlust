import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { useId } from 'react';
import { useTSTZPickerContext } from './context';

export function TZSelect() {
	const ctx = useTSTZPickerContext();
	const id = useId();
	const offsets = [
		'UTC-12:00',
		'UTC-11:00',
		'UTC-10:00',
		'UTC-09:30',
		'UTC-09:00',
		'UTC-08:00',
		'UTC-07:00',
		'UTC-06:00',
		'UTC-05:00',
		'UTC-04:00',
		'UTC-04:30',
		'UTC-03:00',
		'UTC-02:00',
		'UTC-01:00',
		'UTC+00:00',
		'UTC+01:00',
		'UTC+02:00',
		'UTC+03:00',
		'UTC+03:30',
		'UTC+04:00',
		'UTC+04:30',
		'UTC+05:00',
		'UTC+05:30',
		'UTC+05:45',
		'UTC+06:00',
		'UTC+06:30',
		'UTC+07:00',
		'UTC+08:00',
		'UTC+08:45',
		'UTC+09:00',
		'UTC+09:30',
		'UTC+10:00',
		'UTC+10:30',
		'UTC+11:00',
		'UTC+12:00',
		'UTC+12:45',
		'UTC+13:00',
		'UTC+14:00',
	];

	return (
		<Select
			name="Timezone"
			value={ctx.tzOffset}
			onValueChange={(v) => ctx.setTzOffset(v)}
		>
			<SelectTrigger
				id={id}
				aria-invalid={ctx.fieldState.invalid}
				className="max-w-40"
			>
				<SelectValue placeholder="Timezone" />
			</SelectTrigger>
			<SelectContent position="popper" align="end">
				{offsets.map((offset) => (
					<SelectItem key={offset} value={offset}>
						{offset}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
