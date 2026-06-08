import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Separator } from '@wanderlust/ui/components/separator';
import { Edit2Icon, LibraryIcon, PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { keyValueCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DeleteDialog } from '@/components/dashboard/delete-dialog';
import { DashboardLink } from '@/components/dashboard/link';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/collections/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.collections.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { collection } = Route.useLoaderData();
	const invalidate = useInvalidator();
	const navigate = useNavigate();

	const mutation = useMutation(
		orpc.collections.delete.mutationOptions({
			onSuccess: async () => {
				toast.success('Collection deleted');
				await invalidate();
				await navigate({
					to: '/dashboard/collections',
				});
			},
		}),
	);

	const img = collection.items[0]?.place.assets[0] ?? {
		url: '',
		description: '',
	};

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Collections', href: '/dashboard/collections' },
					{
						name: collection.name,
						href: `/dashboard/collections/${collection.id}`,
					},
				]}
			/>

			<Separator className="my-4" />

			<DashboardActions>
				<DashboardLink
					to="/c/$id"
					params={{
						id: collection.id,
					}}
					icon={PaperclipIcon}
					title="Visit Page"
				/>

				<DashboardLink
					to="/dashboard/collections/$id/edit"
					params={{
						id: collection.id,
					}}
					icon={Edit2Icon}
					title="Edit Collection"
				/>

				<DashboardLink
					to="/dashboard/collections/$id/items"
					params={{
						id: collection.id,
					}}
					title="See Collection Items"
					icon={LibraryIcon}
				/>

				<DeleteDialog
					type="collection"
					onClick={() =>
						mutation.mutate({
							id: collection.id,
						})
					}
				/>
			</DashboardActions>

			{img.url !== '' && (
				<Image
					src={ipx(img.url, 'w_256')}
					alt={img.description ?? ''}
					className="mt-4 aspect-video w-64 rounded-md object-cover"
					width={256}
					aspectRatio={16 / 9}
				/>
			)}

			<DataTable
				columns={keyValueCols}
				filterColumnId="key"
				data={[
					{
						k: 'ID',
						v: collection.id,
					},
					{
						k: 'Name',
						v: collection.name,
					},
					{
						k: 'Description',
						v: collection.description,
					},
					{
						k: 'Created At',
						v: new Date(collection.createdAt).toLocaleDateString(),
					},
				]}
			/>
		</>
	);
}
