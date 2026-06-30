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
import { KeyIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function RoleView() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });
	const [text, setText] = useState('');
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<div>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive-ghost" size="sm">
						<KeyIcon />
						Make Admin
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Grant Admin Privileges to {data.name}
						</AlertDialogTitle>
						<AlertDialogDescription>
							<p>
								Are you sure you want to grant admin privileges to {data.name}?
							</p>
							<p className="mt-2">
								You <b>cannot</b> undo this action from the dashboard.
							</p>
							<p className="mt-2">
								This user will have admin access to the system.
							</p>
							<p className="mt-2 text-destructive">
								Make sure you trust this user before granting admin privileges.
							</p>
							<p className="mt-2">
								If you understand the consequences, type <em>I understand</em>{' '}
								below to grant admin privileges.
							</p>
							<Input
								placeholder="With great power comes great responsibility"
								className="mt-4 w-full"
								value={text}
								onChange={(e) => setText(e.target.value)}
								aria-invalid={text !== 'I understand' && text !== ''}
								required
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button variant="destructive" asChild>
							<AlertDialogAction
								disabled={text !== 'I understand'}
								className="disabled:cursor-not-allowed"
								onClick={async () => {
									const { error } = await authClient.admin.setRole({
										role: 'admin',
										userId: data.id,
									});

									if (error) {
										toast.error(error.message);
										return;
									}

									await invalidate();
									toast.success('Granted admin privileges');
								}}
							>
								Grant Admin Privileges
								<KeyIcon />
							</AlertDialogAction>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
