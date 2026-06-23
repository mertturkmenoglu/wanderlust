import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { useId } from 'react';
import { useTSTZPickerContext } from './context';

export function AmPmSelect() {
	const ctx = useTSTZPickerContext();
	const id = useId();

	return (
		<Select
			name="AM/PM"
			value={ctx.isAm ? 'AM' : 'PM'}
			onValueChange={(v) => ctx.setIsAm(v === 'AM')}
		>
			<SelectTrigger id={id} aria-invalid={ctx.fieldState.invalid}>
				<SelectValue placeholder="AM/PM" />
			</SelectTrigger>
			<SelectContent position="popper" align="end">
				<SelectItem value="AM">AM</SelectItem>
				<SelectItem value="PM">PM</SelectItem>
			</SelectContent>
		</Select>
	);
}
