import type { Calendar } from '@wanderlust/ui/components/calendar';
import type {
	ControllerFieldState,
	ControllerRenderProps,
} from 'react-hook-form';

type ShadCnCalendarProps = React.ComponentProps<typeof Calendar>;

export type TSTZPickerProps = {
	value?: Date | null;
	onChange: ControllerRenderProps['onChange'];
	fieldState: ControllerFieldState;
	formatStr?: string;
	calendarProps: Omit<ShadCnCalendarProps, 'onSelect' | 'selected' | 'mode'>;
	dateLabel: string;
	timeLabel: string;
	classNames?: Partial<{
		root: string;
		dateLabel: string;
		trigger: string;
		content: string;
		time: Partial<{
			root: string;
			label: string;
		}>;
	}>;
};
