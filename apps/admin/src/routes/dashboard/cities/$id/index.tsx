import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { BackLink } from '@/components/back-link';
import { Container } from '@/components/container';
import { ObjectDetails } from '@/components/object-details';
import {
	DetailRow,
	DetailTable,
} from '@/components/object-details/detail-table';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { copyToClipboard } from '@/lib/clipboard';
import { appLink } from '@/lib/link';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/cities/$id/')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return context.queryClient.ensureQueryData(
			orpc.cities.get.queryOptions({
				input: {
					id: +params.id,
				},
			}),
		);
	},
	staticData: {
		breadcrumb: (data) => `${data.city.name} Details`,
	},
});

function RouteComponent() {
	const { city } = Route.useLoaderData();
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const confirm = useConfirmDialog();

	const mutation = useMutation(
		orpc.cities.delete.mutationOptions({
			onSuccess: async () => {
				await navigate({ to: '/dashboard/cities' });
				await invalidate();
				toast.success('City deleted');
			},
		}),
	);

	return (
		<Container>
			<BackLink to="/dashboard/cities" text="Cities" />

			{confirm.Dialog}

			<ObjectDetails
				classNames={{
					root: 'mt-4',
				}}
				object={{
					type: 'city',
					id: city.id.toString(),
					title: city.name,
					description: city.description,
				}}
				onEdit={() => {
					navigate({
						to: '/dashboard/cities/$id/edit',
						params: {
							id: city.id.toString(),
						},
					});
				}}
				onVisit={() => {
					navigate({
						href: appLink(`/cities/${city.id}`),
					});
				}}
				onShare={() => {
					copyToClipboard(appLink(`/cities/${city.id}`));
				}}
				onDelete={async () => {
					const ok = await confirm.confirm({
						variant: 'destructive',
						title: 'Delete City',
						description:
							'Are you sure you want to delete this city? This action cannot be undone.',
						confirmText: 'Delete',
						cancelText: 'Cancel',
					});

					if (!ok) {
						return;
					}

					mutation.mutate({
						id: city.id,
					});
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={city.id.toString()} />
					<DetailRow label="Name" value={city.name} />
					<DetailRow label="Description" value={city.description} />
					<DetailRow label="State Code" value={city.stateCode} />
					<DetailRow label="State Name" value={city.stateName} />
					<DetailRow label="Country Code" value={city.countryCode} />
					<DetailRow label="Country Name" value={city.countryName} />
					<DetailRow
						label="Image"
						value={
							<img
								src={city.image}
								alt={city.name}
								className="aspect-video h-32 object-cover"
							/>
						}
					/>
					<DetailRow
						label="Coordinates"
						value={`Lat: ${city.lat}, Lng: ${city.lng}`}
					/>
					<DetailRow label="Timezone" value={city.timezone} />
				</DetailTable>
			</ObjectDetails>
		</Container>
	);
}
