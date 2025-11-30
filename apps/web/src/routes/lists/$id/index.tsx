import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
	EllipsisVerticalIcon,
	FlagIcon,
	PencilIcon,
	TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppMessage } from '@/components/blocks/app-message';
import { BackLink } from '@/components/blocks/back-link';
import { PlaceCard } from '@/components/blocks/place-card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute('/lists/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			context.orpc.lists.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
});

function RouteComponent() {
	const { list } = Route.useLoaderData();
	const navigate = useNavigate();
	const session = authClient.useSession();
	const isOwner = session.data?.user.id === list.userId;
	const invalidate = useInvalidator();

	const deleteMutation = useMutation(
		orpc.lists.delete.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List is deleted.');
				navigate({
					to: '/lists',
				});
			},
		}),
	);

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<BackLink href="/lists" text="Go back to lists" />
			<div className="flex items-center justify-between gap-8">
				<div>
					<h2 className="text-2xl tracking-tighter">{list.name}</h2>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<div>Created by: {list.user.name}</div>
						<div>{new Date(list.createdAt).toLocaleDateString()}</div>
					</div>
					<div className="mt-1 text-muted-foreground text-xs" />
				</div>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger
							className={buttonVariants({ variant: 'ghost', size: 'icon' })}
						>
							<EllipsisVerticalIcon className="" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link
									to="/report"
									search={{
										type: 'list',
										id: list.id,
									}}
									className="flex w-full items-center gap-2"
								>
									<FlagIcon className="size-3" />
									<div className="text-sm">Report</div>
								</Link>
							</DropdownMenuItem>

							{isOwner && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Link
											to="/lists/$id/edit"
											params={{
												id: list.id,
											}}
											className="flex w-full items-center gap-2"
										>
											<PencilIcon className="size-3" />
											<div className="text-sm">Edit</div>
										</Link>
									</DropdownMenuItem>

									<DialogTrigger asChild>
										<DropdownMenuItem>
											<button
												type="button"
												className="flex w-full items-center gap-2 text-destructive"
											>
												<TrashIcon className="size-3" />
												<div className="text-sm">Delete</div>
											</button>
										</DropdownMenuItem>
									</DialogTrigger>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
						</DialogHeader>
						<div className="flex items-center space-x-2 text-sm">
							Are you sure you want to delete this list? This action cannot be
							undone and all data will be permanently deleted.
						</div>
						<DialogFooter className="">
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="button"
								variant="destructive"
								onClick={() =>
									deleteMutation.mutate({
										id: list.id,
									})
								}
							>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Separator className="my-2" />

			{list.items.length === 0 && (
				<AppMessage
					emptyMessage="This list is empty"
					className="my-16"
					backLink="/lists"
					backLinkText="Go back to the lists page"
				/>
			)}

			{list.items.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{list.items.map((listItem) => (
						<Link
							to="/p/$id"
							params={{
								id: listItem.placeId,
							}}
							key={listItem.placeId}
						>
							<PlaceCard place={listItem.place} />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
