import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

export type List = Outputs['lists']['get']['list'];

export type ListItem = List['items'][number];

export function useRemoveListItemMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.lists.removeItem.mutationOptions({
			onSuccess: async () => {
				toast.success('Place removed from list');
				await invalidate();
			},
		}),
	);
}

export function useUpdateListItemsMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.lists.updateItems.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List items updated');
			},
		}),
	);
}

export const updateListSchema = z.object({
	name: z.string().min(1).max(128),
	isPublic: z.boolean(),
});

export type UpdateListInput = z.infer<typeof updateListSchema>;

export function useUpdateListForm(name: string, isPublic: boolean) {
	return useForm({
		resolver: zodResolver(updateListSchema),
		defaultValues: {
			name,
			isPublic,
		},
	});
}

export function useUpdateListMutation() {
	const invalidate = useInvalidator();

	return useMutation(
		orpc.lists.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List updated');
			},
		}),
	);
}
