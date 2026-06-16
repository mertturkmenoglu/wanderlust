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
	hours: { day: string; open: Date; close: Date }[];
};

export function HoursDialog({ hours }: Props) {
	const timeFmt = new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const today = new Date().getUTCDay();
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
					<DialogDescription className="mt-4 flex flex-col gap-4">
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
					</DialogDescription>
				</DialogHeader>
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
