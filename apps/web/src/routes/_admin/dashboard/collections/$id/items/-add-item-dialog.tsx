import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import { Input } from '@wanderlust/ui/components/input';
import { Label } from '@wanderlust/ui/components/label';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PlaceCard } from '@/components/place-card';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

type Props = {
	collectionId: string;
	buttonClassName?: string;
};

export function AddItemDialog({ collectionId, buttonClassName }: Props) {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const [placeId, setPlaceId] = useState('');
	const [ok, setOk] = useState(false);
	const invalidate = useInvalidator();

	const query = useQuery(
		orpc.places.get.queryOptions({
			input: {
				id: placeId,
			},
			enabled: placeId !== '',
			retry: false,
		}),
	);

	const mutation = useMutation(
		orpc.collections.appendItem.mutationOptions({
			onSuccess: async () => {
				toast.success('Item added to collection');
				await invalidate();
				setOpen(false);
			},
		}),
	);

	useEffect(() => {
		if (query.isSuccess) {
			setOk(true);
		}

		if (query.isError) {
			setOk(false);
		}
	}, [query.isSuccess, query.isError]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className={cn(buttonClassName)}>
					<PlusIcon />
					<span>Add Item</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Add New Collection Item</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2 text-sm">
					<div className="mt-4 w-full">
						<Label htmlFor="place-id">Place ID</Label>
						<Input
							type="text"
							id="place-id"
							placeholder="Place ID"
							autoComplete="off"
							className="mt-1"
							value={text}
							onChange={(e) => {
								setText(e.target.value);
								setOk(false);
								setPlaceId('');
							}}
						/>
						<Button
							className="px-0"
							type="button"
							variant="link"
							onClick={() => setPlaceId(text)}
						>
							Preview
						</Button>
						{query.isError && (
							<div className="text-destructive text-xs">
								<div>An error happened:</div>
								<pre className="wrap-break-word mt-2 flex-wrap whitespace-pre-wrap text-wrap">
									{query.error.message}
								</pre>
							</div>
						)}
						{query.isSuccess && (
							<div>
								<PlaceCard place={query.data.place} />
							</div>
						)}
					</div>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="default"
						disabled={!ok}
						onClick={() =>
							mutation.mutate({
								id: collectionId,
								placeId,
							})
						}
					>
						Add to collection
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
