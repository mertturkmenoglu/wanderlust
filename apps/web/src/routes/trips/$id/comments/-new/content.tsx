import { useLoaderData } from '@tanstack/react-router';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@wanderlust/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from '@wanderlust/ui/components/input-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { SendHorizonalIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
	type NewCommentFormInput,
	type NewCommentFormProps,
	useCreateCommentMutation,
} from './hooks';

export function Content({ className }: NewCommentFormProps) {
	const form = useFormContext<NewCommentFormInput>();
	const mutation = useCreateCommentMutation();
	const { trip } = useLoaderData({ from: '/trips/$id' });

	return (
		<form
			className={cn('', className)}
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					content: data.content,
					id: trip.id,
				});
			})}
		>
			<FieldSet>
				<FieldGroup>
					<Controller
						name="content"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="content">Add a comment</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										{...field}
										id="content"
										placeholder="Add your comment here..."
										autoComplete="off"
										rows={4}
										className="max-h-32"
										aria-invalid={fieldState.invalid}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											type="submit"
											variant="default"
											disabled={!field.value || field.value.trim().length === 0}
										>
											Send
											<SendHorizonalIcon />
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}
