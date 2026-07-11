import { TZDate } from '@date-fns/tz';
import { useEffect } from 'react';
import { useTSTZPickerContext } from './context';

export function useFieldUpdateEffect() {
	const ctx = useTSTZPickerContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: ctx.onChange is intentionally omitted from the dependency array.
	useEffect(() => {
		const newDate = new TZDate(ctx.value ?? new Date(), ctx.tzOffset);

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

		ctx.onChange(newDate);
	}, [ctx.hours24, ctx.minutes, ctx.tzOffset, ctx.value]);
}
