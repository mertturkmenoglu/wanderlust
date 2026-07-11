import { createFileRoute } from '@tanstack/react-router';
import { Accordion } from '@wanderlust/ui/components/accordion';
import { useMemo } from 'react';
import { tripUpsertLocationSchema } from '@/schemas/trip-upsert-location';
import { Header } from './-components/header';
import { useTripDays } from './-components/hooks';
import { TripDetailsItem } from './-components/item';

export const Route = createFileRoute('/trips/$id/details/')({
	component: RouteComponent,
	validateSearch: tripUpsertLocationSchema,
});

function RouteComponent() {
	const days = useTripDays();
	const defaultOpenValues = useMemo(() => {
		const arr: string[] = [];

		for (let i = 0; i < days.length; i++) {
			const { isDefaultOpen } = days[i];

			if (isDefaultOpen) {
				arr.push(`day-${i}`);
			}
		}

		return arr;
	}, [days]);

	return (
		<div className="mt-4">
			<Header />

			<div className="">
				<Accordion type="multiple" defaultValue={defaultOpenValues}>
					{days.map(({ day }, i) => (
						<TripDetailsItem key={`trip-day-${day.toISOString()}`} index={i} />
					))}
				</Accordion>
			</div>
		</div>
	);
}
