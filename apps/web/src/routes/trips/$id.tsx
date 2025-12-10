import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { format } from 'date-fns';
import { z } from 'zod';
import { ErrorComponent } from '@/components/error-component';
import { Breadcrumb } from '@/components/trips/breadcrumb';
import { TripInfo } from '@/components/trips/trip-info';

const schema = z.object({
	showLocationDialog: z.boolean().optional(),
	placeId: z.string().optional(),
	isUpdate: z.boolean().optional(),
	description: z.string().optional(),
	scheduledTime: z.string().optional(),
	locId: z.string().optional(),
});

export const Route = createFileRoute('/trips/$id')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.trips.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	validateSearch: schema,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { trip } = Route.useLoaderData();

	return (
		<div>
			<Breadcrumb
				items={[
					{ name: 'Detail', href: '/trips/my-trips' },
					{ name: trip.title, href: `/trips/${trip.id}` },
				]}
			/>

			<div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">
				<TripInfo className="col-span-full w-full md:col-span-1" />

				<div className="col-span-full w-full md:col-span-3">
					<div className="">
						<div className="text-2xl">{trip.title}</div>
						<div
							className="mt-1 text-muted-foreground text-xs"
							title={`${format(trip.startAt, 'PPP')} - ${format(trip.endAt, 'PPP')}`}
						>
							{format(trip.startAt, 'PPP')} - {format(trip.endAt, 'PPP')}
						</div>

						<Separator className="my-2" />

						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
