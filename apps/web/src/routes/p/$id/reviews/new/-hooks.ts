import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { useEffect, useId, useMemo, useRef } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { CustomLink } from '@/components/rich-text/custom-link';
import { rteStyles } from '@/components/rich-text/editor-styles';
import {
	getScoppedStarterKit,
	getUserMentionExtension,
} from '@/components/rich-text/extensions';
import { Hashtag } from '@/components/rich-text/hashtag';
import { orpc } from '@/lib/orpc';

const schema = z.object({
	content: z
		.string({ error: 'Content is required' })
		.min(5, { error: 'Content must be at least 5 characters' })
		.max(2048, { error: 'Content must be at most 2048 characters' }),
	rating: z
		.number({ error: 'Rating is required' })
		.min(1, { error: 'Rating must be at least 1' })
		.max(5, { error: 'Rating must be at most 5' }),
	visitDate: z
		.date({ error: 'Visit date is required' })
		.refine((date) => date <= new Date(), {
			error: 'Visit date cannot be in the future',
		}),
});

export type FormInput = z.infer<typeof schema>;

export function useCreateReviewForm() {
	return useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			rating: 5,
			visitDate: new Date(),
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
	const navigate = useNavigate({ from: '/p/$id/reviews/new/' });

	return useMutation(
		orpc.reviews.create.mutationOptions({
			onSuccess: async (v) => {
				form.reset();
				toast.success('Review added');
				await navigate({
					to: '/p/$id',
					params: {
						id: v.review.placeId,
					},
				});
			},
		}),
	);
}

export function useCreateReviewEditor(opts: {
	value: string;
	onChangeRichTextListener: (value: string) => void;
	onChangePlainTextListener?: (value: string) => void;
}) {
	const callbacksRef = useRef(opts);
	useEffect(() => {
		callbacksRef.current = opts;
	});

	const extensions = useMemo(() => {
		return [
			getScoppedStarterKit(),
			Placeholder.configure({
				placeholder:
					'Leave a review, share your experience and help others discover great places!',
			}),
			CustomLink,
			getUserMentionExtension(),
			Hashtag,
		];
	}, []);

	return useEditor({
		extensions,
		content: opts.value,
		onUpdate: ({ editor }) => {
			callbacksRef.current.onChangeRichTextListener(editor.getHTML());
			callbacksRef.current.onChangePlainTextListener?.(editor.getText());
		},
		editorProps: {
			attributes: {
				class: rteStyles,
			},
		},
	});
}
