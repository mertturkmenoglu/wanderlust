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
import { BellIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { notificationsClient } from '@/lib/notifications';

export function TestNotificationView() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive-ghost" size="sm">
					<BellIcon />
					Create a test notification
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Create a test notification for {data.name}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to create a test notification for {data.name}?
						<p className="mt-2">
							This user will recieve a test notification and you will not be
							able to take it back.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction
							onClick={async () => {
								const res = await notificationsClient['create-dummy'].$post({
									json: {
										userId: data.id,
									},
								});

								if (!res.ok) {
									toast.error('Cannot send a test notification');
									return;
								}

								await invalidate();
								toast.success('Sent a test notification');
							}}
						>
							Send
							<BellIcon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
