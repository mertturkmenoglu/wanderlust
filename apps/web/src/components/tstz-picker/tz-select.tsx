import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { useId, useMemo } from 'react';
import { getIANANames } from '@/lib/timezone';
import { useTSTZPickerContext } from './context';

export function TZSelect() {
	const ctx = useTSTZPickerContext();
	const id = useId();
	const tzOptions = useMemo(() => getIANANames(), []);

	return (
		<Select
			name="Timezone"
			value={ctx.tzOffset}
			onValueChange={(v) => ctx.setTzOffset(v)}
		>
			<SelectTrigger
				id={id}
				aria-invalid={ctx.fieldState.invalid}
				className="w-full"
			>
				<SelectValue placeholder="Timezone" />
			</SelectTrigger>
			<SelectContent position="popper" align="end">
				{tzOptions.map((ianaName) => (
					<SelectItem key={ianaName} value={ianaName}>
						{ianaName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
