import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Calendar } from '@wanderlust/ui/components/calendar';
import { FieldGroup, FieldLabel } from '@wanderlust/ui/components/field';
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
import { useFormContext } from 'react-hook-form';
import { AssetUploader } from '@/components/asset-uploader';
import { useFormElement } from '@/components/form';
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

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate({
			content: data.content,
			rating: data.rating,
			placeId: place.id,
			files: ctx.uploader.acceptedFiles,
			visitedAt: data.visitDate,
		});
	});

	const { Element } = useFormElement(form.control);

	return (
		<form
			id="create-review-form"
			onSubmit={onSubmit}
			className="mt-8 flex flex-col"
		>
			<FieldGroup>
				<Rate />

				<Element name="visitDate" label="Visit Date">
					{(r, id) => (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									id={id}
									className="w-full max-w-fit justify-start font-normal"
								>
									{r.field.value ? (
										format(r.field.value, 'PPP')
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={r.field.value}
									onSelect={r.field.onChange}
									startMonth={subYears(new Date(), 1)}
									endMonth={new Date()}
									disabled={{
										after: new Date(),
										before: subYears(new Date(), 1),
									}}
								/>
							</PopoverContent>
						</Popover>
					)}
				</Element>

				<Element name="content" label="Write Your Review">
					{(r, id) => (
						<InputGroup>
							<InputGroupTextarea
								{...r.field}
								id={id}
								placeholder="Leave a review, share your experience and help others discover great places!"
								rows={isMobile ? 4 : 6}
								autoComplete="off"
								className="min-h-18 md:min-h-36"
								aria-invalid={r.fieldState.invalid}
							/>
							<InputGroupAddon align="block-end">
								<InputGroupText>
									{lengthTracker(r.field.value, 2048)}
								</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					)}
				</Element>

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
