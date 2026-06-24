import { Button } from '@wanderlust/ui/components/button';
import { Calendar } from '@wanderlust/ui/components/calendar';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@wanderlust/ui/components/popover';
import { cn } from '@wanderlust/ui/lib/utils';
import { useId } from 'react';
import { AmPmSelect } from './am-pm-select';
import { AssistedNumberSelect } from './assisted-number-select';
import { useTSTZPickerContext } from './context';
import { useFieldUpdateEffect } from './hooks';
import { TZSelect } from './tz-select';

export function Content() {
	const {
		value,
		onChange,
		fieldState,
		hours24,
		minutes,
		calendarProps,
		formatted,
		dateLabel,
		timeLabel,
		classNames,
	} = useTSTZPickerContext();

	useFieldUpdateEffect();

	const triggerId = useId();

	return (
		<Field data-invalid={fieldState.invalid} className={cn(classNames?.root)}>
			<FieldLabel htmlFor={triggerId} className={cn(classNames?.dateLabel)}>
				{dateLabel}
			</FieldLabel>

			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={triggerId}
						variant="outline"
						className={cn(
							'w-full justify-start font-normal',
							classNames?.trigger,
						)}
					>
						<span>{formatted}</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent
					align="start"
					className={cn('max-w-md', classNames?.content)}
				>
					<Calendar
						mode="single"
						selected={value ?? undefined}
						onSelect={(selected) => {
							if (selected) {
								const newDate = new Date(selected);
								newDate.setHours(hours24);
								newDate.setMinutes(minutes);
								onChange(newDate);
							}
						}}
						{...calendarProps}
					/>

					<FieldGroup className={cn('mt-2', classNames?.time?.root)}>
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel
								htmlFor="start-time"
								className={cn(classNames?.time?.label)}
							>
								{timeLabel}
							</FieldLabel>

							<div className="flex gap-2">
								<AssistedNumberSelect variant="hours" />

								<AssistedNumberSelect variant="minutes" />

								<AmPmSelect />
							</div>

							<TZSelect />
						</Field>
					</FieldGroup>
				</PopoverContent>
			</Popover>

			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}
