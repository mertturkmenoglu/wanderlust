import { useMutation, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreateListDialog } from '@/components/lists/create-list-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export function AddToListButton() {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const [listId, setListId] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const session = authClient.useSession();

	const query = useQuery(
		orpc.lists.checkStatus.queryOptions({
			input: {
				placeId: place.id,
			},
			enabled: !!session.data?.user && open,
		}),
	);

	const invalidate = useInvalidator();
	const [newListDialogOpen, setNewListDialogOpen] = useState(false);

	const mutation = useMutation(
		orpc.lists.appendItem.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Added to the list');
				setOpen(false);
			},
		}),
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="ghost" onClick={() => setOpen(true)}>
								<PlusIcon className={cn('size-6 text-primary')} />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Add to list</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Select a list</DialogTitle>
					<DialogDescription className="w-full">
						{query.data && (
							<Select onValueChange={(v) => setListId(v)}>
								<SelectTrigger className="mt-4 w-full">
									<SelectValue placeholder="Select a list" />
								</SelectTrigger>
								<SelectContent className="max-h-96 w-full">
									{query.data.statuses.map((listStatus) => (
										<SelectItem
											value={listStatus.id}
											key={listStatus.id}
											disabled={listStatus.includes}
											className="wrap-break-word"
										>
											{listStatus.name}
											{listStatus.includes ? ' (Already added)' : ''}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:flex sm:justify-between">
					<CreateListDialog
						open={newListDialogOpen}
						setOpen={setNewListDialogOpen}
						onSuccess={async () => {
							toast.success('List created');
							await invalidate();
							setNewListDialogOpen(false);
						}}
					>
						<Button
							variant="secondary"
							onClick={(e) => {
								e.preventDefault();
								setNewListDialogOpen(true);
							}}
						>
							Create New List
						</Button>
					</CreateListDialog>
					<Button
						type="button"
						variant="default"
						onClick={() => {
							if (!listId) {
								return;
							}
							mutation.mutate({
								id: listId,
								placeId: place.id,
							});
						}}
						disabled={listId === null}
					>
						Add to list
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
