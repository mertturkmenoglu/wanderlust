import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import {
	type CreateTripCommentFormInput,
	createTripCommentSchema,
} from '@/schemas/create-trip-comment';

export type NewCommentFormProps = {
	className?: string;
};

export function useCreateCommentForm() {
	return useForm<CreateTripCommentFormInput>({
		resolver: zodResolver(createTripCommentSchema),
	});
}

export function useCreateCommentMutation() {
	const invalidate = useInvalidator();
	const form = useFormContext<CreateTripCommentFormInput>();

	return useMutation(
		orpc.trips.comments.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment created successfully');
				form.reset({ content: '' });
			},
		}),
	);
}
