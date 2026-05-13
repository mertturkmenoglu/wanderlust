import { useMutation } from '@tanstack/react-query';
import {
	createFileRoute,
	Link,
	notFound,
	useNavigate,
} from '@tanstack/react-router';
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

export const Route = createFileRoute('/_admin/dashboard/categories/$id/')({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const res = await context.orpc.categories.list.call({});
		const category = res.categories.find((c) => c.id === +params.id);

		if (!category) {
			throw notFound();
		}

		return {
			category,
		};
	},
});

function RouteComponent() {
	const { category } = Route.useLoaderData();
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.categories.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({ to: '/dashboard/categories' });
				toast.success('Category deleted');
			},
		}),
	);

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Categories', href: '/dashboard/categories' },
					{
						name: category.name,
						href: `/dashboard/categories/${category.id}`,
					},
				]}
			/>
			<Separator className="my-2" />

			<DashboardActions>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Link to="/categories">
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
						to="/dashboard/categories/$id/edit"
						params={{
							id: `${category.id}`,
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
						type="category"
						onClick={() =>
							mutation.mutate({
								id: category.id,
							})
						}
					/>
				</div>
			</DashboardActions>

			<Image
				src={ipx(category.image, 'w_256')}
				alt={category.name}
				className="mt-4 aspect-video w-64 rounded-md object-cover"
				layout="constrained"
				width={256}
				aspectRatio={16 / 9}
			/>

			<DataTable
				columns={keyValueCols}
				filterColumnId=""
				data={[
					{
						k: 'ID',
						v: `${category.id}`,
					},
					{
						k: 'Name',
						v: category.name,
					},
					{
						k: 'Image URL',
						v: category.image,
					},
				]}
			/>
		</>
	);
}
