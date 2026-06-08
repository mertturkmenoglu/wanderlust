import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
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
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function NewRelationDialog() {
	const [collectionId, setCollectionId] = useState('');
	const [id, setId] = useState('');
	const invalidate = useInvalidator();
	const { mode } = useSearch({
		from: '/_admin/dashboard/collections/relations/',
	});

	const placeMutation = useMutation(
		orpc.collections.createPlaceRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation added');
			},
		}),
	);

	const cityMutation = useMutation(
		orpc.collections.createCityRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation added');
			},
		}),
	);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>
					<PlusIcon className="size-4" />
					<span className="ml-2">New {mode} relation</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Add new {mode} relation</AlertDialogTitle>
					<AlertDialogDescription>
						<Input
							placeholder="Collection ID"
							value={collectionId}
							onChange={(e) => setCollectionId(e.target.value)}
						/>
						<Input
							placeholder={mode === 'place' ? 'Place ID' : 'City ID'}
							className="mt-4"
							value={id}
							onChange={(e) => setId(e.target.value)}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button asChild>
						<AlertDialogAction
							onClick={() => {
								if (mode === 'place') {
									placeMutation.mutate({
										id: collectionId,
										placeId: id,
									});
									return;
								}

								cityMutation.mutate({
									id: collectionId,
									cityId: +id,
								});
							}}
						>
							Add
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
