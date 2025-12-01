import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
};

export function NewComment({ className }: Props) {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const [content, setContent] = useState('');
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.trips.createComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment created successfully');
				setContent('');
			},
		}),
	);

	return (
		<div className={cn(className)}>
			<Label className="text-xs">New Comment</Label>
			<div className="mt-1 flex gap-2">
				<Input
					placeholder="Add a comment"
					className="w-full"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Button
					variant="default"
					size="icon"
					onClick={() => {
						mutation.mutate({
							id: trip.id,
							content,
						});
					}}
					disabled={content.length === 0}
				>
					<span className="sr-only">Comment</span>
					<SendHorizonalIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}
