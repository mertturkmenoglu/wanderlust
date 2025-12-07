import { useMutation } from '@tanstack/react-query';
import { useBlocker, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AppMessage } from '@/components/app-message';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';

type Props = {
	className?: string;
};

export function EditItems({ className }: Props) {
	const invalidate = useInvalidator();
	const { list } = useLoaderData({
		from: '/lists/$id/edit/',
	});

	const form = useForm({
		defaultValues: {
			items: list.items,
		},
	});

	const array = useFieldArray({
		control: form.control,
		name: 'items',
	});

	const mutation = useMutation(
		orpc.lists.updateItems.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List items updated');
			},
		}),
	);

	useBlocker({
		shouldBlockFn: () => {
			if (form.formState.isDirty || mutation.isPending) {
				const shouldLeave = confirm(
					'Are you sure you want to leave? Unsaved changes will be lost.',
				);
				return !shouldLeave;
			}

			return false;
		},
	});

	const initialIsEmpty = list.items.length === 0;

	if (initialIsEmpty) {
		return (
			<AppMessage
				emptyMessage="This list is empty. Add some items to get started."
				className={cn('my-16', className)}
				showBackButton={false}
			/>
		);
	}

	return (
		<div className={cn('flex flex-col space-y-2', className)}>
			<div className="ml-auto">
				<Button
					variant="default"
					size="sm"
					className="ml-auto"
					onClick={() => {
						mutation.mutate({
							id: list.id,
							placeIds: array.fields.map((item) => item.placeId),
						});
					}}
				>
					<SaveIcon />
					<span>Save Changes</span>
				</Button>
			</div>
			{array.fields.map((item, i) => (
				<Item key={item.id} variant={'outline'} className="hover:bg-muted">
					<ItemMedia variant="image">
						<img
							src={ipx(item.place.assets[0]?.url ?? '', 'w_512')}
							alt={item.place.assets[0]?.description ?? ''}
						/>
					</ItemMedia>

					<ItemContent>
						<ItemTitle>{item.place.name}</ItemTitle>
						<ItemDescription>{item.place.category.name}</ItemDescription>
					</ItemContent>

					<ItemActions>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => array.remove(i)}
						>
							<Trash2Icon />
							<span className="sr-only">Remove item</span>
						</Button>

						<Button
							variant="ghost"
							size="icon"
							disabled={i === 0}
							onClick={() => array.move(i - 1, i)}
						>
							<ArrowUpIcon />
							<span className="sr-only">Move item up</span>
						</Button>

						<Button
							variant="ghost"
							size="icon"
							disabled={i === array.fields.length - 1}
							onClick={() => array.move(i, i + 1)}
						>
							<ArrowDownIcon />
							<span className="sr-only">Move item down</span>
						</Button>
					</ItemActions>
				</Item>
			))}
		</div>
	);
}
