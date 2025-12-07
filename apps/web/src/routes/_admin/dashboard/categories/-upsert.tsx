import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { type Outputs, orpc } from '@/lib/orpc';

const schema = z.object({
	id: z.coerce.number().min(1),
	name: z.string().min(1).max(64),
	image: z.string().min(1).max(256).url(),
});

type Props = {
	action: 'create' | 'edit';
	category?: Outputs['categories']['list']['categories'][number];
};

export function UpsertCategory({ action, category }: Props) {
	const [previewUrl, setPreviewUrl] = useState(category?.image ?? '');

	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: category
			? {
					...category,
				}
			: undefined,
	});

	const createMutation = useMutation(
		orpc.categories.create.mutationOptions({
			onSuccess: async () => {
				toast.success('Category created');
				await navigate({ to: '/dashboard/categories', reloadDocument: true });
			},
		}),
	);

	const editMutation = useMutation(
		orpc.categories.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({
					to: '/dashboard/categories/$id',
					params: {
						id: '',
					},
				});
				toast.success('Category updated');
			},
		}),
	);

	return (
		<div>
			<DashboardBreadcrumb
				items={
					action === 'create'
						? [
								{ name: 'Categories', href: '/dashboard/categories' },
								{ name: 'New', href: '/dashboard/categories/new' },
							]
						: [
								{ name: 'Categories', href: '/dashboard/categories' },
								{
									name: category?.name ?? '',
									href: `/dashboard/categories/${category?.id ?? ''}`,
								},
								{
									name: 'Edit',
									href: `/dashboard/categories/${category?.id ?? ''}/edit`,
								},
							]
				}
			/>

			<Separator className="my-4" />

			{previewUrl !== '' && (
				<img
					src={ipx(previewUrl, 'w_512')}
					alt="Preview"
					className="mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form
				className="mx-0 mt-8 max-w-7xl"
				onSubmit={form.handleSubmit((data) => {
					if (action === 'create') {
						createMutation.mutate(data);
					} else {
						if (!category) return;

						editMutation.mutate({
							...data,
							id: category.id,
						});
					}
				})}
			>
				<FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Controller
						name="id"
						control={form.control}
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
						control={form.control}
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
						control={form.control}
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
											disabled={form.watch('image') === ''}
											onClick={() => setPreviewUrl(form.watch('image'))}
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
							disabled={createMutation.isPending || editMutation.isPending}
						>
							{(createMutation.isPending || editMutation.isPending) && (
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
