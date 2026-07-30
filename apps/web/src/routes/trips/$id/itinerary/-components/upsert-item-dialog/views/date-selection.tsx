import { useLoaderData } from '@tanstack/react-router';
import type { ControllerFieldState } from 'react-hook-form';
import { TSTZPicker } from '@/components/tstz-picker';

type Props = {
	id: string;
	value: Date | undefined;
	onChange: (...event: any[]) => void;
	fieldState: ControllerFieldState;
};

export function DateSelection(props: Props) {
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<TSTZPicker
			dateLabel="Date"
			timeLabel="Time"
			formatStr="PP p"
			fieldState={props.fieldState}
			onChange={props.onChange}
			value={props.value}
			calendarProps={{
				className: 'mx-auto',
				startMonth: trip.startAt,
				endMonth: trip.endAt,
				disabled: {
					after: trip.endAt,
					before: trip.startAt,
				},
			}}
		/>
	);
}
