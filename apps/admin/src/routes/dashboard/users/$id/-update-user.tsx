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
import { UserPenIcon } from 'lucide-react';

export function Updateuser() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });

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
					disabled={data.role === 'admin'}
				>
					<UserPenIcon />
					Update User Info
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Update User Info for {data.name}</AlertDialogTitle>
					<AlertDialogDescription>Work in progress</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction onClick={async () => {}} disabled>
							Update
							<UserPenIcon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
