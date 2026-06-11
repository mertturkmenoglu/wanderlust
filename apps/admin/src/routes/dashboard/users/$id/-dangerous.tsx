import { useLoaderData } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { TriangleAlertIcon } from 'lucide-react';
import { BanUser } from './-ban-user';
import { ImpersonateUser } from './-impersonate';
import { RemoveUser } from './-remove-user';
import { RoleView } from './-role';
import { SessionsView } from './-sessions';
import { SetPassword } from './-set-password';
import { TestNotificationView } from './-test-notification';
import { Updateuser } from './-update-user';

type Props = {
	className?: string;
};

export function DangerousActions({ className }: Props) {
	const { data } = useLoaderData({ from: '/dashboard/users/$id/' });

	if (!data) {
		return null;
	}

	if (data.role === 'admin') {
		return null;
	}

	return (
		<div className={cn(className)}>
			<div className="flex flex-row items-center gap-2 text-destructive">
				<TriangleAlertIcon />
				<span>Dangerous</span>
			</div>

			<Separator className="my-2" />

			<div className="mt-4 flex flex-row items-center gap-2">
				<RoleView />

				<BanUser />

				<SessionsView />

				<ImpersonateUser />

				<SetPassword />

				<Updateuser />

				<TestNotificationView />

				<RemoveUser />
			</div>
		</div>
	);
}
