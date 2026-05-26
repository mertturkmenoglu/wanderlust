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
import { Controller, type SubmitHandler } from 'react-hook-form';
import {
	type UpdateListInput,
	useUpdateListForm,
	useUpdateListMutation,
} from './-hooks';

type Props = {
	className?: string;
};

export function EditInfo({ className }: Props) {
	const { list } = useLoaderData({
		from: '/lists/$id/edit/',
	});

	const form = useUpdateListForm(list.name, list.isPublic);
	const mutation = useUpdateListMutation();

	const onSubmit: SubmitHandler<UpdateListInput> = (data) => {
		mutation.mutate({
			id: list.id,
			...data,
		});
	};

	return (
		<div className={cn(className)}>
			<form id="edit-list-form" onSubmit={form.handleSubmit(onSubmit)}>
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

					<Button
						disabled={mutation.isPending}
						type="submit"
						form="edit-list-form"
						size="sm"
					>
						Update
					</Button>
				</FieldGroup>
			</form>
		</div>
	);
}
