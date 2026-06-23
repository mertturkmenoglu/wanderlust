import { tz } from '@date-fns/tz';
import { Button } from '@wanderlust/ui/components/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@wanderlust/ui/components/hover-card';
import { cn } from '@wanderlust/ui/lib/utils';
import { format } from 'date-fns';
import { ClockPlusIcon } from 'lucide-react';
import { getCurrentTimezoneOffset, stripUTCPrefix } from '@/lib/timezone';
import { usePreferencesStore } from '@/stores/preferences-context';

export type TSTZDisplayProps = {
	date: Date;
	formatStr?: string;
	timezones?: { timezone: string; explanation: string }[];
	className?: string;
};

export function TSTZDisplay({
	date,
	formatStr = 'PP p x',
	timezones,
	className,
}: TSTZDisplayProps) {
	const preferences = usePreferencesStore((s) => s.preferences);
	const currentTimezone = getCurrentTimezoneOffset();

	const selectedTimezones = timezones ?? [
		{ timezone: '+00:00', explanation: 'Time in UTC' },
		{
			timezone: preferences.timezone,
			explanation: 'Time in your preferred timezone',
		},
		{
			timezone: currentTimezone,
			explanation: 'Time in your current timezone',
		},
	];

	const mainFormatStr = 'PP p';

	const main = format(date, mainFormatStr);

	const alternativeDisplays = selectedTimezones.map((t) => ({
		formatted: format(date, formatStr, { in: tz(stripUTCPrefix(t.timezone)) }),
		timezone: t.timezone,
		explanation: t.explanation,
	}));

	return (
		<div className={cn(className)}>
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button
						size="sm"
						variant="outline"
						className="w-full justify-between"
					>
						<span>{main}</span>
						<ClockPlusIcon className="size-4" />
					</Button>
				</HoverCardTrigger>
				<HoverCardContent className="flex flex-col gap-2 p-2">
					{alternativeDisplays.map((d, i) => (
						<div key={i}>
							<div className="font-medium text-xs leading-snug">
								{d.formatted}
							</div>
							<div className="text-xs tracking-tighter">{d.explanation}</div>
						</div>
					))}
				</HoverCardContent>
			</HoverCard>
		</div>
	);
}
