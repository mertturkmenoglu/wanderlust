import { useLoaderData } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	ClockAlertIcon,
	ClockArrowUpIcon,
	ClockFadingIcon,
	ClockIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { InfoCard } from '@/components/info-card';
import { useHoursStatus } from '@/hooks/use-hours-status';
import { HoursDialog } from './dialog';
import { mapping, parseHours } from './utils';

type Props = {
	className?: string;
};

export function HoursInfo({ className }: Props) {
	const data = useLoaderData({ from: '/p/$id/' });
	const hours = parseHours(data.place.hours);
	const key = mapping[new Date().getUTCDay()];
	const today = hours.find((h) => h.day === key);

	if (!today) {
		return null;
	}

	const status = useHoursStatus(today.open, today.close);

	const Icon = useMemo(() => {
		if (status === 'closingSoon') {
			return ClockAlertIcon;
		}

		if (status === 'open') {
			return ClockIcon;
		}

		if (status === 'openingSoon') {
			return ClockArrowUpIcon;
		}

		return ClockFadingIcon;
	}, [status]);

	const text = useMemo(() => {
		if (status === 'closingSoon') {
			return 'Closing Soon';
		}

		if (status === 'open') {
			return 'Open Now';
		}

		if (status === 'openingSoon') {
			return 'Opening Soon';
		}

		return 'Closed';
	}, [status]);

	return (
		<InfoCard.Root className={cn(className)}>
			<InfoCard.Content>
				<InfoCard.NumberColumn className="md:text-3xl lg:text-4xl">
					<Icon
						className={cn('size-6 text-primary md:size-10', {
							'text-primary': status === 'open',
							'text-muted-foreground': status === 'closed',
							'text-yellow-500': status === 'closingSoon',
							'text-sky': status === 'openingSoon',
						})}
					/>
				</InfoCard.NumberColumn>
				<InfoCard.DescriptionColumn className="flex flex-col font-semibold text-primary">
					{text}
					<HoursDialog hours={hours} />
				</InfoCard.DescriptionColumn>
			</InfoCard.Content>
		</InfoCard.Root>
	);
}
