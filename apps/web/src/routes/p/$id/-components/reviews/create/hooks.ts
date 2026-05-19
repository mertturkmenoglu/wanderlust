import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useId } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { useCreateReviewContext } from './context';

const schema = z.object({
	content: z
		.string({ error: 'Content is required' })
		.min(5, { error: 'Content must be at least 5 characters' })
		.max(2048, { error: 'Content must be at most 2048 characters' }),
	rating: z
		.number({ error: 'Rating is required' })
		.min(1, { error: 'Rating must be at least 1' })
		.max(5, { error: 'Rating must be at most 5' }),
});

export type FormInput = z.infer<typeof schema>;

export function useCreateReviewForm() {
	return useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			rating: 4,
		},
	});
}

export function useUpload() {
	const service = useMachine(fileUpload.machine, {
		id: useId(),
		accept: ['image/jpeg', 'image/png'],
		maxFiles: 4,
		maxFileSize: 1024 * 1024 * 5, // 5MB
	});

	return fileUpload.connect(service, normalizeProps);
}

export function useCreateReviewMutation() {
	const form = useFormContext<FormInput>();
	const invalidate = useInvalidator();
	const ctx = useCreateReviewContext();

	return useMutation(
		orpc.reviews.create.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				form.reset();
				ctx.setOpen(false);
				toast.success('Review added');
			},
		}),
	);
}
