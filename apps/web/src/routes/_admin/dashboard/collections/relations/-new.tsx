import { useMutation } from '@tanstack/react-query';
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
	);
}
