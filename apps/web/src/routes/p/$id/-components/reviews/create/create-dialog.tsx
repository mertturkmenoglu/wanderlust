import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Rating } from '@/components/kit/rating';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { lengthTracker } from '@/lib/form';
import { orpc } from '@/lib/orpc';
import { useUpload } from './hooks';
import { ImageUploadArea } from './image-upload';

const schema = z.object({
	content: z.string().min(5).max(2048),
});

export function CreateReviewDialog() {
	const session = authClient.useSession();
	const isAuthenticated = !session.isPending && session.data?.user != null;

	if (!isAuthenticated) {
		return (
			<Button variant="default" size="sm" asChild>
				<Link to="/sign-in">
					<PencilIcon className="mr-2 size-4" />
					<span>Add a review</span>
				</Link>
			</Button>
		);
	}

	return <Content />;
}

function Content() {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const [rating, setRating] = useState(0);
	const up = useUpload();
	const files = up.acceptedFiles;
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
	});

	const createReviewMutation = useMutation(
		orpc.reviews.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				form.reset();
				setRating(0);
				toast.success('Review added');
			},
		}),
	);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="default" size="sm">
					<PencilIcon className="mr-2 size-4" />
					<span>Add a review</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Add a review</AlertDialogTitle>
					<AlertDialogDescription>
						Add a review to {place.name}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="grid gap-4 py-2">
					<div className="flex flex-row items-center justify-center gap-2">
						<span className="sr-only">Rating</span>
						<Rating
							id="rating"
							defaultValue={0}
							value={rating}
							onChange={(v) => {
								setRating(v.value);
							}}
							disabled={false}
							starsClassName="size-8"
						/>
					</div>

					<div>
						<Label htmlFor="content">Review</Label>
						<Textarea
							id="content"
							rows={5}
							placeholder="Leave a review"
							className="mt-1"
							{...form.register('content')}
						/>
						<span>{lengthTracker(form.watch('content'), 2048)}</span>
						{form.formState.errors.content && (
							<span>{form.formState.errors.content.message}</span>
						)}
					</div>

					<ImageUploadArea up={up} />
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							createReviewMutation.mutate({
								files,
								content: form.getValues('content'),
								placeId: place.id,
								rating,
							});
						}}
					>
						Create
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
