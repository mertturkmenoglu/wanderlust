import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
} from '@wanderlust/ui/components/select';
import { useTSTZPickerContext } from './context';
import { numericRegex, selectableHours, selectableMinutes } from './utils';

type Props = {
	variant: 'hours' | 'minutes';
};

export function AssistedNumberSelect({ variant }: Props) {
	const ctx = useTSTZPickerContext();
	const value = variant === 'hours' ? ctx.sHours12 : ctx.sMinutes;
	const setValue = variant === 'hours' ? ctx.sSetHours12 : ctx.sSetMinutes;
	const selectableValues =
		variant === 'hours' ? selectableHours : selectableMinutes;

	return (
		<InputGroup>
			<InputGroupInput
				value={value}
				onChange={(e) => {
					const newValue = e.target.value;

					if (newValue === '') {
						setValue('');
						return;
					}

					if (!numericRegex.test(newValue)) {
						return;
					}

					const asNumber = Number.parseInt(newValue, 10);

					if (variant === 'hours') {
						if (asNumber < 1 || asNumber > 12) {
							return;
						}
					} else {
						if (asNumber < 0 || asNumber > 59) {
							return;
						}
					}

					setValue(newValue);
				}}
				onBlur={() => {
					if (value === '') {
						setValue('00');
					} else {
						setValue((prev) => prev.padStart(2, '0'));
					}
				}}
			/>

			<InputGroupAddon align="inline-end">
				<Select
					name={`select-${variant}`}
					value={value}
					onValueChange={(v) => {
						setValue(v);
					}}
				>
					<SelectTrigger
						id={`select-${variant}-trigger`}
						aria-invalid={ctx.fieldState.invalid}
						size="sm"
						className="border-none px-0 py-0 shadow-none"
					>
						<span />
					</SelectTrigger>
					<SelectContent
						position="popper"
						align="end"
						className="w-20 min-w-20"
					>
						<SelectGroup>
							<SelectLabel className="capitalize">{variant}</SelectLabel>
							{selectableValues.map((value) => (
								<SelectItem key={value} value={value}>
									{value}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</InputGroupAddon>
		</InputGroup>
	);
}
