import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	EllipsisVerticalIcon,
	FlagIcon,
	PencilIcon,
	TrashIcon,
} from 'lucide-react';
import { useDeleteMutation, useIsOwner, useListQuery } from './-hooks';

export function Menu() {
	const query = useListQuery();
	const { list } = query.data;
	const isOwner = useIsOwner();
	const mutation = useDeleteMutation();

	return (
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
								<DropdownMenuItem variant="destructive">
									<button
										type="button"
										className="group flex w-full items-center gap-2 text-destructive"
									>
										<TrashIcon className="size-3 group-hover:text-destructive" />
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
							mutation.mutate({
								id: list.id,
							})
						}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
