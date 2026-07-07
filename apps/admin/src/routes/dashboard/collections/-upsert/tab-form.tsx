import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@wanderlust/ui/components/input';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useForm } from 'react-hook-form';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { useUpsertDirtyEventListener } from '@/hooks/use-upsert-dirty-event-listener';
import type { Collection } from '@/resources/collections';
import { collectionsResource as res } from '@/resources/collections';
import { schema } from './schema';

export function TabForm({ action, entity }: UpsertProps<Collection>) {
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
				edit.mutate(data, {
					onSuccess: (v) => {
						form.reset(v.collection);
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

	return (
		<form onSubmit={onSubmit}>
			<FormContainer action={action}>
				<Element name="id" label="ID">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="ID"
							disabled={action === 'edit'}
							{...r.field}
						/>
					)}
				</Element>

				<Element name="name" label="Name">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Name"
							{...r.field}
						/>
					)}
				</Element>

				<Element name="description" label="Description">
					{(r, id) => (
						<Textarea
							id={id}
							aria-invalid={r.fieldState.invalid}
							rows={6}
							placeholder="Description"
							{...r.field}
						/>
					)}
				</Element>

				<SubmitButton
					action={action}
					isLoading={create.isPending || edit.isPending}
				/>
			</FormContainer>
		</form>
	);
}
