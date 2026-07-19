import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import { Card, CardContent, CardFooter } from '@wanderlust/ui/components/card';
import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { useUpsertDirtyEventListener } from '@/hooks/use-upsert-dirty-event-listener';
import {
	type Category,
	categoriesResource as res,
} from '@/resources/categories';

const schema = z.object({
	id: z.string().min(1).max(63),
	attributions: z
		.object({
			type: z.string().min(1).max(16),
			text: z.string().min(1).max(1024),
			link: z.url().min(1).max(512),
		})
		.array()
		.max(10),
	description: z.string().min(1).max(512),
	displayName: z.string().min(1).max(64),
	image: z.url().min(1).max(512),
	name: z.string().min(1).max(64),
});

export function Upsert({ action, entity }: UpsertProps<Category>) {
	const [previewUrl, setPreviewUrl] = useState(entity?.image ?? '');

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: entity ?? {},
	});

	const create = res.useCreate();

	const edit = res.useUpdate();

	const onSubmit = form.handleSubmit(
		(data) => {
			if (action === 'create') {
				create.mutate(data);
			} else {
				edit.mutate(data, {
					onSuccess: (v) => {
						form.reset(v.category);
					},
				});
			}
		},
		(err) => {
			console.error('Form submission error:', err);
		},
	);

	useUpsertDirtyEventListener(form);

	const { Element } = useFormElement(form.control);
	const farr = useFieldArray({
		control: form.control,
		name: 'attributions',
	});

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

					<Element name="displayName" label="Display Name">
						{(r, id) => (
							<Input id={id} placeholder="Display Name" {...r.field} />
						)}
					</Element>

					<Element name="description" label="Description">
						{(r, id) => (
							<Input id={id} placeholder="Description" {...r.field} />
						)}
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

					<Field orientation="horizontal" className="gap-16">
						<FieldLabel htmlFor="attrs" className="min-w-64 capitalize">
							Attributions
						</FieldLabel>

						<div className="w-full">
							<Card size="sm">
								<CardContent>
									<ItemGroup className="gap-2">
										{farr.fields.map((field, i) => (
											<Item key={field.id} variant="outline" size="xs">
												<ItemMedia>
													<Badge>{field.type}</Badge>
												</ItemMedia>
												<ItemContent>
													<ItemTitle>{field.text}</ItemTitle>
													<ItemDescription>{field.link}</ItemDescription>
												</ItemContent>
												<ItemActions>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => farr.remove(i)}
													>
														<XIcon />
													</Button>
												</ItemActions>
											</Item>
										))}
									</ItemGroup>
								</CardContent>

								<CardFooter>
									<Button>Add</Button>
								</CardFooter>
							</Card>

							{form.getFieldState('attributions').error && (
								<FieldError
									errors={[form.getFieldState('attributions').error]}
								/>
							)}
						</div>
					</Field>

					<SubmitButton
						action={action}
						isLoading={create.isPending || edit.isPending}
					/>
				</FormContainer>
			</form>
		</div>
	);
}
