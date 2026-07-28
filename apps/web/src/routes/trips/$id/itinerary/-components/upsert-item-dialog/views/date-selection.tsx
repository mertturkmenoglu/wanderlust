import { Button } from '@wanderlust/ui/components/button';
import { Calendar } from '@wanderlust/ui/components/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@wanderlust/ui/components/popover';
import { format, subMonths } from 'date-fns';

type Props = {
	id: string;
	value: Date | undefined;
	onChange: (...event: any[]) => void;
};

export function DateSelection(props: Props) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						id={props.id}
						className="w-full max-w-md justify-start font-normal"
					>
						{props.value ? (
							format(props.value, 'PP p')
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				}
			/>

			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={props.value}
					onSelect={props.onChange}
					startMonth={subMonths(new Date(), 1)}
					endMonth={new Date()}
					disabled={{
						after: new Date(),
						before: subMonths(new Date(), 1),
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
