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
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function SessionsView() {
	const { data } = useLoaderData({ from: '/_admin/dashboard/users/$id/' });
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive-ghost"
					size="sm"
					disabled={data.role === 'admin'}
				>
					<RefreshCwIcon />
					Revoke All Sessions
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Revoke All Sessions for {data.name}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to revoke all sessions for {data.name}?
						<p className="mt-2">
							This user will be signed out of all their sessions and they will
							have to use their credentials/social accounts to sign in again.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction
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
							Revoke All Sessions
							<RefreshCwIcon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
