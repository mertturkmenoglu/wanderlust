import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@wanderlust/ui/components/alert-dialog';
import { Item, ItemGroup, ItemTitle } from '@wanderlust/ui/components/item';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { orpc } from '@/lib/orpc';

type Props = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	displayName: string;
};

export function InviteToTripDialog(props: Props) {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const navigate = useNavigate({ from: '/u/$username' });

	const query = useInfiniteQuery(
		orpc.trips.list.infiniteOptions({
			input: (p) => ({
				page: p,
				pageSize: 10,
			}),
			enabled: props.open,
			initialPageParam: 1,
			getNextPageParam: ({ pagination }) =>
				!pagination.hasNext ? null : pagination.page + 1,
			retry: false,
		}),
	);

	const flat = useFlattenedQuery(query.data, (p) => p.trips);

	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Invite {props.displayName} to a trip
					</AlertDialogTitle>
					<AlertDialogDescription>Select a trip</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					{query.isLoading && <Spinner />}
					<ItemGroup className="gap-2">
						{flat.map((t) => (
							<button
								type="button"
								key={t.id}
								onClick={() => {
									setSelectedId(t.id);
								}}
							>
								<Item
									size="xs"
									variant="outline"
									className={cn('', {
										'border border-primary bg-primary/10 text-primary outline outline-primary':
											selectedId === t.id,
										'hover:bg-muted': selectedId !== t.id,
									})}
								>
									<ItemTitle>{t.title}</ItemTitle>
								</Item>
							</button>
						))}
					</ItemGroup>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={selectedId === null}
						onClick={async () => {
							if (!selectedId) return;

							await navigate({
								to: '/trips/$id/participants/invites/new',
								params: {
									id: selectedId,
								},
							});
						}}
					>
						Invite
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
