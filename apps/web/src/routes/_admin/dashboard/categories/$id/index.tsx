import { useMutation } from '@tanstack/react-query';
import {
	createFileRoute,
	Link,
	notFound,
	useNavigate,
} from '@tanstack/react-router';
import { ArrowRightIcon, Edit2Icon, PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { DeleteDialog } from '@/components/blocks/dashboard/delete-dialog';
import { Button } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
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

			<img
				src={ipx(category.image, 'w_512')}
				alt={category.name}
				className="mt-4 aspect-video w-64 rounded-md object-cover"
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
