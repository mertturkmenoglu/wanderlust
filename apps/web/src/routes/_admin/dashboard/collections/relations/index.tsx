import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { AppMessage } from '@/components/app-message';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export const Route = createFileRoute(
	'/_admin/dashboard/collections/relations/',
)({
	component: RouteComponent,
	validateSearch: z.object({
		mode: z.enum(['place', 'city']).optional().catch('place'),
	}),
});

function RouteComponent() {
	const [collectionId, setCollectionId] = useState('');
	const [placeId, setPlaceId] = useState('');
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.collections.createPlaceRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation added');
			},
		}),
	);

	return (
		<div>
			<DashboardBreadcrumb
				items={[
					{ name: 'Collections', href: '/dashboard/collections' },
					{
						name: 'Relations',
						href: '/dashboard/collections/relations',
					},
				]}
			/>

			<Separator className="my-4" />

			<div className="flex items-center justify-between">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button>
							<PlusIcon className="size-4" />
							<span className="ml-2">New</span>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="sm:max-w-xl">
						<AlertDialogHeader>
							<AlertDialogTitle>Add new relation</AlertDialogTitle>
							<AlertDialogDescription>
								<Input
									placeholder="Collection ID"
									value={collectionId}
									onChange={(e) => setCollectionId(e.target.value)}
								/>
								<Input
									placeholder="Place ID"
									className="mt-4"
									value={placeId}
									onChange={(e) => setPlaceId(e.target.value)}
								/>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button asChild>
								<AlertDialogAction
									onClick={() => {
										mutation.mutate({
											id: collectionId,
											placeId,
										});
									}}
								>
									Add
								</AlertDialogAction>
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<Content />
		</div>
	);
}

function Content() {
	const query = useQuery(
		orpc.collections.listAllPlaceCollections.queryOptions({
			input: {
				page: 1,
				pageSize: 50,
			},
		}),
	);
	const invalidate = useInvalidator();
	const mutation = useMutation(
		orpc.collections.deletePlaceRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation removed');
			},
		}),
	);

	if (query.error) {
		return <AppMessage errorMessage="Something went wrong" />;
	}

	if (query.data) {
		if (query.data.relations.length === 0) {
			return <AppMessage emptyMessage="No data" showBackButton={false} />;
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2">
				{query.data.relations.map((c) => (
					<div
						key={`${c.collectionId}-${c.placeId}`}
						className="rounded-md border border-border p-6"
					>
						<div>
							<span className="font-bold">Collection ID:</span>
							{c.collectionId}
						</div>
						<div>
							<span className="font-bold">Place ID:</span>
							{c.placeId}
						</div>
						<div>
							<span className="font-bold">Index:</span>
							{c.index}
						</div>
						<Button
							variant="destructive"
							size="icon"
							className="mt-2"
							onClick={() => {
								// mutation.mutate({
								//   collectionId: item.collectionId,
								//   poiId: item.poiId,
								// });
							}}
						>
							<TrashIcon className="size-4" />
							<span className="sr-only">Remove relation</span>
						</Button>
					</div>
				))}
			</div>
		);
	}

	return <Spinner className="mx-auto my-16" />;
}
