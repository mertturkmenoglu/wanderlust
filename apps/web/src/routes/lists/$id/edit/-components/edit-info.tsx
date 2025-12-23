import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { cn } from '@wanderlust/ui/lib/utils';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

type Props = {
	className?: string;
};

const schema = z.object({
	name: z.string().min(1).max(128),
	isPublic: z.boolean(),
});

export function EditInfo({ className }: Props) {
	const invalidate = useInvalidator();
	const { list } = useLoaderData({
		from: '/lists/$id/edit/',
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: list.name,
			isPublic: list.isPublic,
		},
	});

	const mutation = useMutation(
		orpc.lists.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List updated');
			},
		}),
	);

	return (
		<div className={cn(className)}>
			<form
				id="edit-list-form"
				onSubmit={form.handleSubmit((data) => {
					mutation.mutate({
						id: list.id,
						...data,
					});
				})}
				className="max-w-md"
			>
				<FieldGroup>
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
									autoComplete="off"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="isPublic"
						control={form.control}
						render={({ field, fieldState }) => (
							<FieldSet data-invalid={fieldState.invalid}>
								<FieldLegend variant="label">Visibility</FieldLegend>
								<FieldDescription>
									Making your list public allows other users to view it.
								</FieldDescription>
								<FieldGroup data-slot="checkbox-group">
									<Field orientation="horizontal">
										<Checkbox
											id="is-public"
											name={field.name}
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<FieldLabel htmlFor="is-public" className="font-normal">
											Public list
										</FieldLabel>
									</Field>
								</FieldGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</FieldSet>
						)}
					/>
				</FieldGroup>

				<Button
					disabled={mutation.isPending}
					type="submit"
					form="edit-list-form"
					className="mt-4"
					size="sm"
				>
					Update
				</Button>
			</form>
		</div>
	);
}
