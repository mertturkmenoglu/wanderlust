import { useLoaderData } from '@tanstack/react-router';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@wanderlust/ui/components/alert-dialog';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function RemoveUser() {
	const { data } = useLoaderData({ from: '/_admin/dashboard/users/$id/' });
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					disabled={data.role === 'admin'}
				>
					<Trash2Icon />
					Remove user
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove {data.name}</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-col">
						<p>Are you sure you want to remove {data.name}?</p>
						<p className="mt-2 text-destructive">
							This action cannot be undone.
						</p>
						<p className="mt-2">
							This action will <b>hard delete</b> {data.name}'s account and all
							their data.
						</p>
						<p className="mt-2">
							If you understand the consequences, type the <b>ID of the user</b>{' '}
							to confirm.
						</p>
						<span
							className="mt-4 w-full bg-muted p-4 text-muted-foreground"
							aria-disabled="true"
							inert
						>
							{data.id}
						</span>

						<Input
							className="mt-2"
							placeholder="Type the user ID to confirm"
							value={text}
							onChange={(e) => setText(e.target.value)}
							type="text"
							required
							aria-invalid={text !== data.id}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction
							disabled={text !== data.id}
							onClick={async () => {
								const { error } = await authClient.admin.revokeUserSessions({
									userId: data.id,
								});

								if (error) {
									toast.error(error.message);
									return;
								}

								await invalidate();
								toast.success('Revoked all sessions successfully');
							}}
						>
							Hard Delete User
							<Trash2Icon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
