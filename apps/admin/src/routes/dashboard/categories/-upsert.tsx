import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { type Category, categoriesResource } from '@/resources/categories';

const res = categoriesResource;

const schema = z.object({
	id: z.transform(Number).pipe(z.number().min(1)),
	name: z.string().min(1).max(64),
	image: z.url().min(1).max(256),
});

export function Upsert({ action, entity }: UpsertProps<Category>) {
	const [previewUrl, setPreviewUrl] = useState(entity?.image ?? '');

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			...(entity ?? {}),
		},
	});

	const create = res.useCreate();

	const edit = res.useUpdate();

	const onSubmit = form.handleSubmit(
		(data) => {
			if (action === 'create') {
				create.mutate(data);
			} else {
				edit.mutate(data);
			}
		},
		(err) => {
			console.error('Form submission error:', err);
		},
	);

	const { Element } = useFormElement(form.control);

	return (
		<div>
			{previewUrl !== '' && (
				<img
					src={previewUrl}
					alt="Preview"
					className="mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form onSubmit={onSubmit}>
				<FormContainer action={action}>
					<Element name="id" label="ID">
						{(r, id) => (
							<Input
								id={id}
								placeholder="ID"
								aria-invalid={r.fieldState.invalid}
								disabled={action === 'edit'}
								{...r.field}
							/>
						)}
					</Element>

					<Element name="name" label="Name">
						{(r, id) => <Input id={id} placeholder="Name" {...r.field} />}
					</Element>

					<Element name="image" label="Image URL">
						{(r, id) => (
							<InputGroup>
								<InputGroupInput
									id={id}
									placeholder="https://example.com/image.jpg"
									aria-invalid={r.fieldState.invalid}
									{...r.field}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										type="button"
										variant="link"
										size="sm"
										disabled={form.watch('image') === ''}
										onClick={() => setPreviewUrl(form.watch('image'))}
									>
										Preview
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
						)}
					</Element>

					<SubmitButton
						action={action}
						isLoading={create.isPending || edit.isPending}
					/>
				</FormContainer>
			</form>
		</div>
	);
}
