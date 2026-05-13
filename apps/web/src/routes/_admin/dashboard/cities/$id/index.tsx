import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Separator } from '@wanderlust/ui/components/separator';
import { ArrowRightIcon, Edit2Icon, PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { keyValueCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { DeleteDialog } from '@/components/dashboard/delete-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/_admin/dashboard/cities/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			context.orpc.cities.get.queryOptions({
				input: {
					id: +params.id,
				},
			}),
		),
});

function RouteComponent() {
	const { city } = Route.useLoaderData();
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.cities.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({ to: '/dashboard/cities' });
				toast.success('City deleted');
			},
		}),
	);

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Cities', href: '/dashboard/cities' },
					{
						name: city.name,
						href: `/dashboard/cities/${city.id}`,
					},
				]}
			/>
			<Separator className="my-2" />

			<DashboardActions>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link
						to="/cities/$"
						params={{
							_splat: `${city.id}`,
						}}
					>
						<Item variant="outline" className="hover:bg-muted">
							<ItemMedia variant="icon">
								<PaperclipIcon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Visit Page</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Button variant="ghost">
									<ArrowRightIcon />
								</Button>
							</ItemActions>
						</Item>
					</Link>

					<Link
						to="/dashboard/cities/$id/edit"
						params={{
							id: `${city.id}`,
						}}
					>
						<Item variant="outline" className="max-w-sm hover:bg-muted">
							<ItemMedia variant="icon">
								<Edit2Icon />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Edit</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Button variant="ghost">
									<ArrowRightIcon />
								</Button>
							</ItemActions>
						</Item>
					</Link>

					<DeleteDialog
						type="city"
						onClick={() =>
							mutation.mutate({
								id: city.id,
							})
						}
					/>
				</div>
			</DashboardActions>

			<Image
				src={ipx(city.image, 'w_256')}
				alt={city.name}
				className="mt-4 aspect-video w-64 rounded-md object-cover"
				width={256}
				aspectRatio={16 / 9}
			/>

			<DataTable
				columns={keyValueCols}
				filterColumnId=""
				data={[
					{
						k: 'ID',
						v: `${city.id}`,
					},
					{
						k: 'Name',
						v: city.name,
					},
					{
						k: 'State Code',
						v: city.stateCode,
					},
					{
						k: 'State Name',
						v: city.stateName,
					},
					{
						k: 'Country Code',
						v: city.countryCode,
					},
					{
						k: 'Country Name',
						v: city.countryName,
					},
				]}
			/>
		</>
	);
}
