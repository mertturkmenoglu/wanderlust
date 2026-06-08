import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { ArrowRightIcon, Edit2Icon, PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardActions } from '@/components/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { DeleteDialog } from '@/components/dashboard/delete-dialog';
import { DashboardLink } from '@/components/dashboard/link';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/dashboard/places/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			context.orpc.places.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
});

function RouteComponent() {
	const { place } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.places.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({ to: '/dashboard/places' });
				toast.success('Place deleted');
			},
		}),
	);

	return (
		<>
			<DashboardBreadcrumb
				items={[
					{ name: 'Places', href: '/dashboard/places' },
					{
						name: place.name,
						href: `/dashboard/places/${place.id}`,
					},
				]}
			/>

			<Separator className="my-4" />

			<DashboardActions>
				<DashboardLink
					to="/p/$id"
					params={{
						id: place.id,
					}}
					icon={PaperclipIcon}
					title="Visit Page"
					action={ArrowRightIcon}
				/>

				<DashboardLink
					to="/dashboard/places/$id/edit"
					params={{
						id: place.id,
					}}
					icon={Edit2Icon}
					title="Edit"
					action={ArrowRightIcon}
				/>

				<DeleteDialog
					type="place"
					onClick={() => {
						mutation.mutate({
							id: place.id,
						});
					}}
				/>
			</DashboardActions>

			<div className="my-8 text-center text-muted-foreground text-sm">
				Visit place details page to see the details.
			</div>
		</>
	);
}
