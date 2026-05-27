import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { TriangleAlertIcon, XIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';

type Props = {
	className?: string;
};

export function ImpersonationBanner({ className }: Props) {
	const onClick = async () => {
		await authClient.admin.stopImpersonating();
		window.location.reload();
	};

	return (
		<div
			className={cn(
				'flex w-full flex-row items-center bg-warning p-4 text-warning-foreground',
				className,
			)}
		>
			<TriangleAlertIcon />
			<p className="ml-4">
				You are impersonating a user. Any action taken will be performed as the
				impersonated user.
			</p>
			<Button className="ml-auto" variant="midnight" onClick={onClick}>
				<XIcon />
				<span>Stop Impersonating</span>
			</Button>
		</div>
	);
}
