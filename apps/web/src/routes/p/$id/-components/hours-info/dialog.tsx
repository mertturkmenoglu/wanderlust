import { TZDate } from '@date-fns/tz';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { cn } from '@wanderlust/ui/lib/utils';
import { isEqual } from 'date-fns';
import { mapping } from './utils';

type Props = {
	tz: string;
	hours: { day: string; open: Date; close: Date }[];
};

export function HoursDialog({ tz, hours }: Props) {
	const timeFmt = new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const today = new TZDate(new Date(), tz).getUTCDay();
	const key = mapping[today];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="link"
					className="px-0! text-xs tracking-tight"
					size="sm"
				>
					See Opening Hours
				</Button>
			</DialogTrigger>
			<DialogContent className="w-xs">
				<DialogHeader>
					<DialogTitle>Opening Hours</DialogTitle>
					<DialogDescription>
						Local time: {timeFmt.format(new TZDate(new Date(), tz))}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					{hours.map((h) => (
						<div
							key={h.day}
							className={cn('flex justify-between', {
								'-m-2 bg-primary/10 p-2 text-primary': h.day === key,
							})}
						>
							<div className="font-bold capitalize">{h.day}</div>
							<div>
								{isEqual(h.open, h.close) ? (
									<span>Closed</span>
								) : (
									<span>
										{timeFmt.format(h.open)} &ndash; {timeFmt.format(h.close)}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" size="sm">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
