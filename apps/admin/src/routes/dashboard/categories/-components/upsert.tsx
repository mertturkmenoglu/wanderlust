import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import z from 'zod';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useUpsert } from '@/hooks/use-upsert';
import { type Outputs, orpc } from '@/lib/orpc';

const schema = z.object({
	id: z.transform(Number).pipe(z.number().min(1)),
	name: z.string().min(1).max(64),
	image: z.url().min(1).max(256),
});

type Category = Outputs['categories']['list']['categories'][number];

export type UpsertProps = {
	action: 'create' | 'edit';
	category?: Category;
};

export function Upsert({ action, category }: UpsertProps) {
	const [previewUrl, setPreviewUrl] = useState(category?.image ?? '');
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const upsert = useUpsert({
		action,
		resolver: zodResolver(schema),
		entity: category,
		edit: orpc.categories.update.mutationOptions({
			onSuccess: async (v) => {
				await invalidate();
				await navigate({
					to: '/dashboard/categories/$id',
					params: {
						id: v.category.id.toString(),
					},
				});
			},
		}),
		create: orpc.categories.create.mutationOptions({
			onSuccess: async (v) => {
				await navigate({
					to: '/dashboard/categories/$id',
					params: { id: v.category.id.toString() },
				});
			},
		}),
	});

	const onSubmit = upsert.form.handleSubmit((data) => {
		if (action === 'create') {
			upsert.create.mutate(data);
		} else {
			upsert.edit.mutate(data);
		}
	});

	const crumbs = useBreadcrumbs();

	return (
		<div>
			<Breadcrumbs crumbs={crumbs} />

			<Separator className="my-4" />

			{previewUrl !== '' && (
				<img
					src={previewUrl}
					alt="Preview"
					className="mx-auto mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form onSubmit={onSubmit}>
				<FieldGroup className="mx-auto mt-8 max-w-3xl">
					<Controller
						name="id"
						control={upsert.form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="id">ID</FieldLabel>
								<Input
									{...field}
									id="id"
									placeholder="ID"
									disabled={action === 'edit'}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="name"
						control={upsert.form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									{...field}
									id="name"
									placeholder="Name"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="image"
						control={upsert.form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="image">Image URL</FieldLabel>

								<InputGroup>
									<InputGroupInput
										{...field}
										id="image"
										placeholder="https://example.com/image.jpg"
										aria-invalid={fieldState.invalid}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											type="button"
											variant="link"
											size="sm"
											disabled={upsert.form.watch('image') === ''}
											onClick={() => setPreviewUrl(upsert.form.watch('image'))}
										>
											Preview
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<div />

					<div className="col-span-full flex items-center justify-end gap-2">
						<Button
							variant="default"
							type="submit"
							disabled={upsert.create.isPending || upsert.edit.isPending}
						>
							{(upsert.create.isPending || upsert.edit.isPending) && (
								<Spinner className="text-white!" />
							)}
							<span>
								{action === 'create' ? 'Create Category' : 'Edit Category'}
							</span>
						</Button>
					</div>
				</FieldGroup>
			</form>
		</div>
	);
}
