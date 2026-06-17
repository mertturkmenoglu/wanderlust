import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Calendar } from '@wanderlust/ui/components/calendar';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from '@wanderlust/ui/components/input-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@wanderlust/ui/components/popover';
import { format, subYears } from 'date-fns';
import { Controller, useFormContext } from 'react-hook-form';
import { AssetUploader } from '@/components/asset-uploader';
import { useIsMobile } from '@/hooks/use-mobile';
import { lengthTracker } from '@/lib/form';
import { useCreateReviewContext } from './-context';
import { type FormInput, useCreateReviewMutation } from './-hooks';
import { Rate } from './-rate';

export function CreateReviewForm() {
	const form = useFormContext<FormInput>();
	const ctx = useCreateReviewContext();
	const isMobile = useIsMobile();
	const mutation = useCreateReviewMutation();
	const { place } = useLoaderData({ from: '/p/$id/reviews/new/' });

	return (
		<form
			id="create-review-form"
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					content: data.content,
					rating: data.rating,
					placeId: place.id,
					files: ctx.uploader.acceptedFiles,
					visitedAt: new Date(),
				});
			})}
			className="mt-8 flex flex-col"
		>
			<FieldGroup>
				<Rate />

				<Controller
					name="visitDate"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="visitDate">Visit Date</FieldLabel>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										id="date-picker-simple"
										className="w-full max-w-fit justify-start font-normal"
									>
										{field.value ? (
											format(field.value, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										startMonth={subYears(new Date(), 1)}
										endMonth={new Date()}
										disabled={{
											after: new Date(),
											before: subYears(new Date(), 1),
										}}
									/>
								</PopoverContent>
							</Popover>

							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="content"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="content">Write Your Review</FieldLabel>
							<InputGroup>
								<InputGroupTextarea
									{...field}
									id="content"
									placeholder="Leave a review, share your experience and help others discover great places!"
									rows={isMobile ? 4 : 6}
									autoComplete="off"
									className="min-h-18 md:min-h-36"
									aria-invalid={fieldState.invalid}
								/>
								<InputGroupAddon align="block-end">
									<InputGroupText>
										{lengthTracker(field.value, 2048)}
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<div>
					<FieldLabel>Add Photos</FieldLabel>
					<span className="text-muted-foreground text-xs">Optional</span>
					<AssetUploader
						uploader={ctx.uploader}
						classNames={{
							root: 'mt-1',
							selector: {
								dropzone: 'py-16!',
							},
						}}
					/>
				</div>
			</FieldGroup>
		</form>
	);
}
