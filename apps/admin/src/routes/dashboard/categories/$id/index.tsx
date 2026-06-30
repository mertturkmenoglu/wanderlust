import { useMutation } from '@tanstack/react-query';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
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

export const Route = createFileRoute('/dashboard/categories/$id/')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const res = await orpc.categories.list.call({});
		const category = res.categories.find((c) => c.id === +params.id);

		if (!category) {
			throw notFound();
		}

		return {
			category,
		};
	},
	staticData: {
		breadcrumb: (data) => data.category.name,
	},
});

function RouteComponent() {
	const { category } = Route.useLoaderData();
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const confirm = useConfirmDialog();

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
		<Container>
			<BackLink to="/dashboard/categories" text="Categories" />

			{confirm.Dialog}

			<ObjectDetails
				classNames={{
					root: 'mt-4',
				}}
				object={{
					type: 'category',
					title: category.name,
					id: `${category.id}`,
				}}
				onEdit={() =>
					navigate({
						to: '/dashboard/categories/$id/edit',
						params: { id: `${category.id}` },
					})
				}
				onVisit={() => {
					navigate({
						href: appLink(`/categories/${category.id}`),
					});
				}}
				onShare={() => {
					copyToClipboard(appLink(`/categories/${category.id}`));
				}}
				onDelete={async () => {
					const ok = await confirm.confirm({
						variant: 'destructive',
						title: 'Delete Category',
						description: `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`,
						confirmText: 'Delete',
						cancelText: 'Cancel',
					});

					if (!ok) {
						return;
					}

					mutation.mutate({
						id: category.id,
					});
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={category.id} />

					<DetailRow label="Name" value={category.name} />

					<DetailRow
						label="Image"
						value={
							<img
								src={category.image}
								alt={category.name}
								className="aspect-video h-32 object-cover"
							/>
						}
					/>
				</DetailTable>
			</ObjectDetails>
		</Container>
	);
}
