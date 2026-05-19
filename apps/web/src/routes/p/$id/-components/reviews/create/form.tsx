import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { AssetUploader } from '@/components/asset-uploader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCreateReviewContext } from './context';
import { type FormInput, useCreateReviewMutation } from './hooks';

export function CreateReviewForm() {
	const form = useFormContext<FormInput>();
	const ctx = useCreateReviewContext();
	const isMobile = useIsMobile();
	const mutation = useCreateReviewMutation();
	const { place } = useLoaderData({ from: '/p/$id/' });

	return (
		<form
			id="create-review-form"
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					content: data.content,
					rating: data.rating,
					placeId: place.id,
					files: ctx.uploader.acceptedFiles,
				});
			})}
			className="flex flex-col md:col-span-2"
		>
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>

			<Button
				type="button"
				variant="outline"
				size="sm"
				className="my-2 self-end"
				onClick={() => {
					ctx.setShowAssetUpload((prev) => {
						if (prev) {
							ctx.uploader.clearFiles();
						}

						return !prev;
					});
				}}
			>
				{ctx.showAssetUpload ? <XIcon /> : <ImagePlusIcon />}
				{ctx.showAssetUpload ? 'Cancel' : 'Add images'}
			</Button>

			{ctx.showAssetUpload && (
				<AssetUploader uploader={ctx.uploader} className="" />
			)}
		</form>
	);
}
