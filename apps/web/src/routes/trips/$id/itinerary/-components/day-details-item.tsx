import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@wanderlust/ui/components/accordion';
import { cn } from '@wanderlust/ui/lib/utils';
import { formatDate } from 'date-fns';
import { AppMessage } from '@/components/app-message';
import { useTripDays } from './hooks';
import { ItineraryItem } from './item';

type Props = {
	index: number;
};

export function TripDayDetailsItem({ index }: Props) {
	const days = useTripDays();
	const { day, items } = days[index];

	return (
		<AccordionItem
			value={`day-${index}`}
			key={`day-${day.toISOString()}`}
			className="mt-2 border-none"
		>
			<AccordionTrigger className="flex w-full items-center">
				<div className="font-semibold text-lg">Day {index + 1}</div>

				<div className="ml-auto text-muted-foreground text-sm">
					{formatDate(day, 'dd MMM')}
				</div>
			</AccordionTrigger>
			<AccordionContent
				className={cn('my-4 grid grid-cols-1 gap-16', {
					'gap-16 border-border border-l-4': items.length > 0,
				})}
			>
				{items.length === 0 && (
					<AppMessage
						empty="Nothing is scheduled for this day"
						classNames={{
							root: 'col-span-full my-4',
							logo: 'size-16',
						}}
					/>
				)}

				{items
					.sort(
						(a, b) =>
							new Date(a.scheduledTime).getTime() -
							new Date(b.scheduledTime).getTime(),
					)
					.map((item) => (
						<ItineraryItem key={item.id} item={item} />
					))}
			</AccordionContent>
		</AccordionItem>
	);
}
