import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownIcon, ArrowUpIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AppMessage } from '@/components/blocks/app-message';
import { BackLink } from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authGuard } from '@/lib/auth';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/lists/$id/edit/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			context.orpc.lists.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		),
});

function RouteComponent() {
	const { list } = Route.useLoaderData();
	const invalidate = useInvalidator();

	const [name, setName] = useState(list.name);
	const form = useForm({
		defaultValues: {
			items: list.items,
		},
	});

	const array = useFieldArray({
		control: form.control,
		name: 'items',
	});
	const [isPublic, setIsPublic] = useState(list.isPublic);
	const [isListDirty, setIsListDirty] = useState(false);
	const isErr = name.length > 128 || name.length === 0;
	const showErr = isListDirty && isErr;

	const updateListMutation = useMutation(
		orpc.lists.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				setIsListDirty(false);
				toast.success('List updated');
			},
		}),
	);

	const updateListItemsMutation = useMutation(
		orpc.lists.updateItems.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('List items updated');
			},
		}),
	);

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<BackLink href={`/lists/${list.id}`} text="Go back to the list page" />
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl tracking-tighter">Editing: {list.name}</h2>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<div>Created by: {list.user.name}</div>
						<div>{new Date(list.createdAt).toLocaleDateString()}</div>
					</div>
				</div>
			</div>
			<div className="mt-4">
				<div className="max-w-xl space-y-4">
					<div className="w-full">
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							id="name"
							placeholder="Name"
							autoComplete="off"
							className="mt-1 w-full"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setIsListDirty(true);
							}}
						/>
						{showErr && (
							<div className="mt-1 text-destructive text-sm">
								Name length should be between 1 and 128 characters
							</div>
						)}
					</div>

					<div className="flex w-full items-start gap-2">
						<Checkbox
							id="is-public"
							checked={isPublic}
							onCheckedChange={(c) => {
								setIsListDirty(true);
								setIsPublic(c === true);
							}}
						/>
						<div>
							<Label htmlFor="is-public">Public list</Label>
							<span>If you make your list public, other users can see it.</span>
						</div>
					</div>

					<Button
						size="sm"
						disabled={!isListDirty}
						onClick={() =>
							updateListMutation.mutate({
								id: list.id,
								isPublic,
								name,
							})
						}
					>
						Update
					</Button>
				</div>
			</div>

			<Separator className="my-4" />

			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="font-bold">List Items</div>
					{form.watch('items').length > 0 && form.formState.isDirty && (
						<div className="flex">
							<Button
								variant="default"
								size="sm"
								className="ml-auto"
								disabled={!form.formState.isDirty}
								onClick={() => {
									updateListItemsMutation.mutate({
										id: list.id,
										placeIds: form
											.getValues('items')
											.map((item) => item.placeId),
									});
								}}
							>
								<SaveIcon className="size-4" />
								<span>Save Changes</span>
							</Button>
						</div>
					)}
				</div>
				{form.watch('items').length === 0 && (
					<AppMessage
						emptyMessage="This list is empty"
						className="my-16"
						showBackButton={false}
					/>
				)}
				{form.watch('items').map((item, i) => (
					<div key={item.place.id} className="flex items-center gap-2">
						<div className={cn('group', 'flex items-center gap-4')}>
							<img
								src={ipx(item.place.assets[0]?.url ?? '', 'w_512')}
								alt={item.place.assets[0]?.description ?? ''}
								className="aspect-video w-full max-w-36 rounded-md object-cover"
							/>

							<div className="my-2">
								<div className="mt-2 font-semibold text-lg capitalize">
									{item.place.name}
								</div>
							</div>
						</div>
						<Button
							variant="destructive"
							size="icon"
							className="ml-auto"
							onClick={() => {
								array.remove(i);
							}}
						>
							<span className="sr-only">Remove</span>
							<Trash2Icon className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={i === 0}
							onClick={() => {
								array.move(i - 1, i);
							}}
						>
							<span className="sr-only">Move Up</span>
							<ArrowUpIcon className="size-4" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							disabled={i === form.watch('items').length - 1}
							onClick={() => {
								array.move(i, i + 1);
							}}
						>
							<span className="sr-only">Move Down</span>
							<ArrowDownIcon className="size-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
