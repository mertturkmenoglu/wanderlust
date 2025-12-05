import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { CustomMarkdownEditor } from '@/components/blocks/dashboard/markdown-editor';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

const schema = z.object({
	name: z.string().min(1).max(128),
	description: z.string().min(1).max(4096),
});

type Props = {
	action: 'create' | 'edit';
	collection?: Outputs['collections']['get']['collection'];
};

export function UpsertCollection({ action, collection }: Props) {
	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: collection
			? {
					name: collection.name,
					description: collection.description,
				}
			: undefined,
	});

	const createMutation = useMutation(
		orpc.collections.create.mutationOptions({
			onSuccess: async (data) => {
				toast.success('Collection created');
				await navigate({
					to: '/dashboard/collections/$id',
					params: {
						id: data.collection.id,
					},
					reloadDocument: true,
				});
			},
		}),
	);

	const editMutation = useMutation(
		orpc.collections.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({
					to: '/dashboard/collections/$id',
					params: {
						id: collection?.id ?? '',
					},
				});
				toast.success('Collection updated');
			},
		}),
	);

	return (
		<div>
			<DashboardBreadcrumb
				items={
					action === 'create'
						? [
								{ name: 'Collections', href: '/dashboard/collections' },
								{ name: 'New', href: '/dashboard/collections/new' },
							]
						: [
								{ name: 'Collections', href: '/dashboard/collections' },
								{
									name: collection?.name ?? '',
									href: `/dashboard/collections/${collection?.id ?? ''}`,
								},
								{
									name: 'Edit',
									href: `/dashboard/collections/${collection?.id ?? ''}/edit`,
								},
							]
				}
			/>

			<Separator className="my-4" />

			<form
				className="mx-0 mt-8 max-w-7xl"
				onSubmit={form.handleSubmit((data) => {
					if (action === 'create') {
						createMutation.mutate(data);
					} else {
						if (!collection) return;

						editMutation.mutate({
							...data,
							id: collection.id,
						});
					}
				})}
			>
				<FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

					<div />

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="col-span-full"
							>
								<FieldLabel htmlFor="description">Description</FieldLabel>
								<CustomMarkdownEditor
									value={field.value}
									setValue={field.onChange}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

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
								{action === 'create' ? 'Create Collection' : 'Edit Collection'}
							</span>
						</Button>
					</div>
				</FieldGroup>
			</form>
		</div>
	);
}
