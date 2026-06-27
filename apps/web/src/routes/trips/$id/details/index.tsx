import { createFileRoute } from '@tanstack/react-router';
import { Accordion } from '@wanderlust/ui/components/accordion';
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
	const defaultOpenValues = days
		.map(({ isDefaultOpen }, i) => (isDefaultOpen ? `day-${i}` : undefined))
		.filter(Boolean) as string[];

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
