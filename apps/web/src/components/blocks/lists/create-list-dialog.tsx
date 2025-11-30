import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	children: React.ReactNode;
	onSuccess: (data: Outputs['lists']['create']) => Promise<void>;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateListDialog({
	children,
	onSuccess,
	open,
	setOpen,
}: Props) {
	const [name, setName] = useState('');
	const [isPublic, setIsPublic] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const isErr = name.length > 128 || name.length === 0;
	const showErr = isDirty && isErr;

	const mutation = useMutation(
		orpc.lists.create.mutationOptions({
			onSuccess,
		}),
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Create a List</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="w-full">
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							id="name"
							placeholder="My Favorite Places"
							autoComplete="off"
							className="mt-1 w-full"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setIsDirty(true);
							}}
						/>
						{showErr && (
							<div className="mt-1 text-destructive text-xs">
								Name length should be between 1 and 128 characters
							</div>
						)}
					</div>

					<div className="flex w-full">
						<Checkbox
							id="is-public"
							checked={isPublic}
							onCheckedChange={(c) => {
								setIsPublic(c === true);
							}}
						/>
						<div className="ml-2">
							<Label htmlFor="is-public">Public list</Label>
							<span>If you make your list public, other users can see it.</span>
						</div>
					</div>
				</div>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>

					<Button
						type="button"
						variant="default"
						disabled={isErr}
						onClick={() =>
							mutation.mutate({
								isPublic,
								name,
							})
						}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
