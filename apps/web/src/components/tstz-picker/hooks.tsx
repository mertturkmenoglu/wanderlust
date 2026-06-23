import { TZDate, tz } from '@date-fns/tz';
import { getHours, getMinutes, transpose } from 'date-fns';
import { useEffect } from 'react';
import { useTSTZPickerContext } from './context';

export function useFieldUpdateEffect() {
	const ctx = useTSTZPickerContext();

	useEffect(() => {
		const newDate = new TZDate(ctx.value ?? new Date());

		if (Number.isNaN(ctx.hours24)) {
			newDate.setHours(0);
		} else {
			newDate.setHours(ctx.hours24);
		}

		if (Number.isNaN(ctx.minutes)) {
			newDate.setMinutes(0);
		} else {
			newDate.setMinutes(ctx.minutes);
		}

		const transposed = transpose(newDate, tz(ctx.tzOffset));
		const hours = getHours(transposed, {
			in: tz(ctx.tzOffset),
		});
		const minutes = getMinutes(transposed, {
			in: tz(ctx.tzOffset),
		});

		console.log({
			value: ctx.value,
			newDate,
			transposed,
			hours,
			minutes,
			tzOffset: ctx.tzOffset,
			hoursVia: transposed.getUTCHours(),
			minutesVia: transposed.getUTCMinutes(),
		});

		ctx.sSetHours12(hours.toString().padStart(2, '0'));
		ctx.sSetMinutes(minutes.toString().padStart(2, '0'));

		ctx.onChange(transposed);
	}, [ctx.hours24, ctx.minutes, ctx.tzOffset]);
}
