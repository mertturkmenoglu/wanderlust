import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export type NewCommentFormProps = {
	className?: string;
};

export const newCommentSchema = z.object({
	content: z.string({ error: 'Required' }).min(1),
});

export type NewCommentFormInput = z.infer<typeof newCommentSchema>;

export function useCreateCommentForm() {
	return useForm<NewCommentFormInput>({
		resolver: zodResolver(newCommentSchema),
	});
}

export function useCreateCommentMutation() {
	const invalidate = useInvalidator();
	const form = useFormContext<NewCommentFormInput>();

	return useMutation(
		orpc.trips.createComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment created successfully');
				form.reset({ content: '' });
			},
		}),
	);
}
