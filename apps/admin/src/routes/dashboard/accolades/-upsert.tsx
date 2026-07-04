import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@wanderlust/ui/components/input';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { useUpsertDirtyEventListener } from '@/hooks/use-upsert-dirty-event-listener';
import { type Accolade, accoladesResource as res } from '@/resources/accolades';

const schema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	badge: z.string(),
	image: z.url(),
});

export function Upsert({ action, entity }: UpsertProps<Accolade>) {
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
						form.reset(v.accolade);
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

				<Element name="title" label="Title">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Title"
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

				<Element name="badge" label="Badge">
					{(r, id) => (
						<Input
							id={id}
							placeholder="https://example.com/badge.png"
							aria-invalid={r.fieldState.invalid}
							type="url"
							{...r.field}
						/>
					)}
				</Element>

				<Element name="image" label="Image">
					{(r, id) => (
						<Input
							id={id}
							placeholder="https://example.com/image.png"
							aria-invalid={r.fieldState.invalid}
							type="url"
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
