import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { ImagePlusIcon, PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AssetUploader } from '@/components/asset-uploader';
import { Rating } from '@/components/rating';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { useUpload } from './hooks';

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
	const uploader = useUpload();
	const files = uploader.acceptedFiles;
	const invalidate = useInvalidator();
	const [showFileUpload, setShowFileUpload] = useState(false);
	const isMobile = useIsMobile();

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
			<AlertDialogContent className="sm:max-w-5xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Add a review</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="grid gap-4 py-2 md:grid-cols-3">
					<div className="md:col-span-1">
						<Image
							src={ipx(place.assets[0].url, 'w_512')}
							alt={place.assets[0].description ?? ''}
							className="aspect-5/2 w-full rounded-md object-cover md:aspect-video"
							aspectRatio={16 / 9}
							width={512}
						/>
						<div className="my-4 text-center text-muted-foreground">
							{place.name}
						</div>
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
								starsClassName="size-6 md:size-8"
							/>
						</div>
					</div>
					<div className="flex flex-col md:col-span-2">
						<FieldGroup>
							<Controller
								name="content"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="content">Review</FieldLabel>
										<Textarea
											{...field}
											id="content"
											placeholder="Leave a review"
											rows={isMobile ? 4 : 6}
											autoComplete="off"
											className="min-h-18 md:min-h-36"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>

						{showFileUpload ? (
							<AssetUploader uploader={uploader} className="py-2" />
						) : (
							<Button
								variant="outline"
								size="sm"
								className="my-2 self-end"
								onClick={() => setShowFileUpload(true)}
							>
								<ImagePlusIcon />
								Add images
							</Button>
						)}
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={async (e) => {
							if (!form.formState.isValid) {
								toast.error('Write a review');
								e.preventDefault();
								e.stopPropagation();
								return;
							}

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
