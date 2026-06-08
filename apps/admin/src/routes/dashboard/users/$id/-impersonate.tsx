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
import { HatGlassesIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function ImpersonateUser() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive-ghost"
					size="sm"
					disabled={data.role === 'admin' || data.banned === true}
				>
					<HatGlassesIcon />
					Impersonate user
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Impersonate {data.name}</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to impersonate {data.name}? Any action taken
						will be performed as the impersonated user.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction
							onClick={async () => {
								const { error } = await authClient.admin.impersonateUser({
									userId: data.id,
								});

								if (error) {
									toast.error(error.message);
									return;
								}

								await invalidate();
								toast.success('Impersonating user');
								window.location.reload();
							}}
						>
							Impersonate
							<HatGlassesIcon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
