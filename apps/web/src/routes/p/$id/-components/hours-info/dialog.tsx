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
	intervals: {
		off: boolean;
		open: string;
		close: string;
	}[];
};

const timeFmt = new Intl.DateTimeFormat('en-US', {
	hour: '2-digit',
	minute: '2-digit',
});

export function HoursDialog({ tz, intervals }: Props) {
	const today = new TZDate(new Date(), tz).getUTCDay();
	const key = mapping[today];

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="link"
						className="px-0! text-xs tracking-tight"
						size="sm"
					>
						See Opening Hours
					</Button>
				}
			/>
			<DialogContent className="w-xs">
				<DialogHeader>
					<DialogTitle>Opening Hours</DialogTitle>
					<DialogDescription>
						Local time: {timeFmt.format(new TZDate(new Date(), tz))}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					{intervals.map((h) => (
						<div
							key={h.open + h.close}
							className={cn('flex justify-between', {})}
						>
							<div className="font-bold capitalize">{key}</div>
							<div>
								{isEqual(h.open, h.close) ? (
									<span>Closed</span>
								) : (
									<span>
										{timeFmt.format(new TZDate(h.open, tz))} &ndash;{' '}
										{timeFmt.format(new TZDate(h.close, tz))}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
				<DialogFooter>
					<DialogClose
						render={
							<Button variant="outline" size="sm">
								Close
							</Button>
						}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
