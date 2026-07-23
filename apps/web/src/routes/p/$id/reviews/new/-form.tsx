import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Calendar } from '@wanderlust/ui/components/calendar';
import { FieldGroup, FieldLabel } from '@wanderlust/ui/components/field';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@wanderlust/ui/components/popover';
import { format, subYears } from 'date-fns';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AssetUploader } from '@/components/asset-uploader';
import { useFormElement } from '@/components/form';
import { orpc } from '@/lib/orpc';
import { useCreateReviewContext } from './-context';
import { CreateReviewEditor } from './-editor';
import { type FormInput, useCreateReviewMutation } from './-hooks';
import { Rate } from './-rate';

export function CreateReviewForm() {
	const form = useFormContext<FormInput>();
	const ctx = useCreateReviewContext();
	const mutation = useCreateReviewMutation();
	const { place } = useLoaderData({ from: '/p/$id/reviews/new/' });
	const [plainText, setPlainText] = useState('');

	const uploadMutation = useMutation(orpc.assets.createMany.mutationOptions());

	const onSubmit = form.handleSubmit(async (data) => {
		const files = ctx.uploader.acceptedFiles;
		const fileIds: string[] = [];

		if (files.length > 0) {
			const res = await uploadMutation.mutateAsync({
				assets: files.map((file) => ({
					file,
					attributions: [],
					for: 'review',
					alt: null,
				})),
			});

			fileIds.push(...res.assets.map((a) => a.id));
		}

		mutation.mutate({
			// We want the text version of the content to be sent to the backend, and process it into its facets there.
			// We don't want to send the Tiptap JSON to the backend because it is not the format we wanted.
			content: plainText,
			rating: data.rating,
			placeId: place.id,
			files: fileIds.length > 0 ? fileIds : undefined,
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
							<PopoverTrigger
								render={
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
								}
							/>

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
					{(r) => (
						<div className="flex-1 resize-none rounded-none">
							<CreateReviewEditor
								value={r.field.value}
								onChangeRichTextListener={r.field.onChange}
								onChangePlainTextListener={setPlainText}
								onBlur={r.field.onBlur}
							/>
						</div>
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
