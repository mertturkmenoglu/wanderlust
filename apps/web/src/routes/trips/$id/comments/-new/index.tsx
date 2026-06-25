import { FormProvider } from 'react-hook-form';
import { Content } from './content';
import { type NewCommentFormProps, useCreateCommentForm } from './hooks';

export function NewCommentForm(props: NewCommentFormProps) {
	const form = useCreateCommentForm();

	return (
		<FormProvider {...form}>
			<Content {...props} />
		</FormProvider>
	);
}
