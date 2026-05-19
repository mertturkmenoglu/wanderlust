import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { orpc } from '@/lib/orpc';
import { useReportContext } from './-context';

export const searchSchema = z.object({
	id: z.string().catch(''),
	type: z.string().catch(''),
});

export const formSchema = z.object({
	resourceId: z.string({ error: 'Resource ID is required' }).min(1),
	resourceType: z.string({ error: 'Resource Type is required' }).min(1),
	description: z.string({ error: 'Description is required' }).min(1).max(256),
	reason: z.string({ error: 'Reason is required' }).min(1),
});

export type FormInput = z.infer<typeof formSchema>;

export const reasons = [
	{
		id: '1',
		name: 'Spam',
	},
	{
		id: '2',
		name: 'Inappropriate',
	},
	{
		id: '3',
		name: 'Fake',
	},
	{
		id: '4',
		name: 'Other',
	},
];

export function useReportForm() {
	const { id, type } = useSearch({ from: '/report/' });

	return useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			resourceId: id,
			resourceType: type,
		},
	});
}

export function useCreateReportMutation() {
	const ctx = useReportContext();

	return useMutation(
		orpc.reports.create.mutationOptions({
			onSuccess: () => {
				toast.success('Report created successfully');
				ctx.setSubmitted(true);
			},
		}),
	);
}
