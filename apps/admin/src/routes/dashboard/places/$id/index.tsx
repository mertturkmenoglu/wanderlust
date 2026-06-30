import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Container } from '@/components/container';
import { ObjectDetails } from '@/components/object-details';
import { DetailLink } from '@/components/object-details/detail-link';
import {
	DetailRow,
	DetailTable,
} from '@/components/object-details/detail-table';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { copyToClipboard } from '@/lib/clipboard';
import { appLink } from '@/lib/link';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/places/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			orpc.places.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
	staticData: {
		breadcrumb: (data) => data.place.name,
	},
});

function RouteComponent() {
	const { place } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const invalidate = useInvalidator();
	const qc = useQueryClient();

	const confirm = useConfirmDialog();
	const { city, ...rest } = place.address;

	const mutation = useMutation(
		orpc.places.delete.mutationOptions({
			onSuccess: async () => {
				qc.removeQueries(
					orpc.places.get.queryOptions({ input: { id: place.id } }),
				);

				await navigate({ to: '/dashboard/places' });
				await invalidate();

				toast.success('Place deleted');
			},
		}),
	);

	return (
		<Container>
			{confirm.Dialog}

			<ObjectDetails
				classNames={{
					root: 'mt-4',
				}}
				object={{
					id: place.id,
					title: place.name,
					type: 'place',
					description: place.description,
				}}
				onEdit={() => {
					navigate({
						to: '/dashboard/places/$id/edit',
						params: {
							id: place.id,
						},
					});
				}}
				onVisit={() => {
					navigate({
						href: appLink(`/p/${place.id}`),
					});
				}}
				onShare={() => {
					copyToClipboard(appLink(`/p/${place.id}`));
				}}
				onDelete={async () => {
					const ok = await confirm.confirm({
						variant: 'destructive',
						title: 'Delete Place',
						description:
							'Are you sure you want to delete this place? This action cannot be undone.',
						confirmText: 'Delete',
						cancelText: 'Cancel',
					});

					if (!ok) {
						return;
					}

					mutation.mutate({
						id: place.id,
					});
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={place.id} />
					<DetailRow label="Name" value={place.name} />
					<DetailRow label="Description" value={place.description} />
					<DetailRow label="Phone" value={place.phone} />
					<DetailRow
						label="Website"
						value={
							<DetailLink
								to="."
								text="Website"
								href={place.website ?? ''}
								external
							/>
						}
					/>
					<DetailRow
						label="Address"
						value={
							<div>
								<DetailLink text="Address" to="/dashboard" />
								<pre className="text-wrap">{JSON.stringify(rest, null, 2)}</pre>
							</div>
						}
					/>
					<DetailRow
						label="Category"
						value={
							<div>
								<DetailLink text="Category" to="/dashboard" />
								<pre>{JSON.stringify(place.category, null, 2)}</pre>
							</div>
						}
					/>
					<DetailRow label="Price Level" value={place.priceLevel} />
					<DetailRow label="A11Y Level" value={place.accessibilityLevel} />
					<DetailRow label="Total Votes" value={place.totalVotes} />
					<DetailRow label="Total Points" value={place.totalPoints} />
					<DetailRow label="Total Favorites" value={place.totalFavorites} />
					<DetailRow
						label="Hours"
						value={<pre>{JSON.stringify(place.hours, null, 2)}</pre>}
					/>
					<DetailRow
						label="Amenities"
						value={<pre>{JSON.stringify(place.amenities, null, 2)}</pre>}
					/>
					<DetailRow
						label="Accolades"
						value={<pre>{JSON.stringify(place.accolades, null, 2)}</pre>}
					/>
					<DetailRow label="Created At" value={place.createdAt.toISOString()} />
					<DetailRow label="Updated At" value={place.updatedAt.toISOString()} />
					<DetailRow
						label="Assets"
						value={
							<div className="flex w-3xl flex-wrap gap-4">
								{place.assets.map((asset) => (
									<Link to="/">
										<img
											src={asset.url}
											alt=""
											className="aspect-video h-32 object-cover"
										/>
									</Link>
								))}
							</div>
						}
					/>
				</DetailTable>
			</ObjectDetails>
		</Container>
	);
}
