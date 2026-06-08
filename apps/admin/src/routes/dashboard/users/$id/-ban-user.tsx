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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { GavelIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function BanUser() {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState('');
	const [duration, setDuration] = useState<string>();
	const invalidate = useInvalidator();

	if (!data) {
		return null;
	}

	if (data.banned === true) {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive-ghost" size="sm">
						<GavelIcon />
						Unban
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unban {data.name}</AlertDialogTitle>
						<AlertDialogDescription>
							<span>Are you sure you want to unban this user?</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button variant="default" asChild>
							<AlertDialogAction
								onClick={async () => {
									await authClient.admin.unbanUser({ userId: data.id });
									await invalidate();
								}}
							>
								Unban User
							</AlertDialogAction>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive-ghost"
					size="sm"
					onClick={() => setOpen(true)}
				>
					<GavelIcon />
					Ban this user
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Ban {data.name}</AlertDialogTitle>
					<AlertDialogDescription>
						<span>Are you sure you want to ban this user?</span>
						<Input
							placeholder="Ban reason"
							className="mt-4 w-full"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							required
						/>
						<Select
							value={duration}
							onValueChange={(v) => setDuration(v)}
							required
						>
							<SelectTrigger className="mt-4 w-full">
								<SelectValue placeholder="Ban duration" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="infinite">Infinite</SelectItem>
								<SelectItem value="86400">1 Day</SelectItem>
								<SelectItem value="604800">7 Days</SelectItem>
								<SelectItem value="1209600">14 Days</SelectItem>
								<SelectItem value="2592000">30 Days</SelectItem>
							</SelectContent>
						</Select>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction
							disabled={reason.length === 0}
							onClick={async () => {
								let exp: number | undefined;

								if (duration === undefined) {
									exp = undefined;
								} else if (duration === 'infinite') {
									exp = undefined;
								} else {
									exp = Number.parseInt(duration ?? '1', 10);
								}

								const { error } = await authClient.admin.banUser({
									userId: data.id,
									banReason: reason,
									banExpiresIn: exp,
								});

								if (error) {
									toast.error(error.message);
									return;
								}

								await invalidate();
								toast.success('User banned successfully');
								setOpen(false);
							}}
						>
							Ban User <GavelIcon />
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
