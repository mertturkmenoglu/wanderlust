import { Button } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { toast } from 'sonner';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { authClient } from '@/lib/auth';
import { useHasProvider } from './-hooks';

type Props = {
	provider: 'google' | 'facebook';
	className?: string;
};

export function SocialLogin({ provider, className }: Props) {
	const hasProvider = useHasProvider(provider);
	const ProviderIcon = provider === 'google' ? GoogleIcon : FacebookIcon;

	const confirm = useConfirmDialog();

	const link = async () => {
		await authClient.linkSocial({
			provider: provider,
			callbackURL: `${window.location.origin}/settings/account/`,
		});
	};

	const unlink = async () => {
		const ok = await confirm.confirm({
			cancelText: 'Cancel',
			confirmText: 'Unlink',
			variant: 'destructive',
			title: `Unlink ${provider === 'google' ? 'Google' : 'Meta'} account`,
			description: (
				<>
					<p>
						Are you sure you want to unlink your{' '}
						{provider === 'google' ? 'Google' : 'Meta'} account?
					</p>

					<br />

					<p>
						Unlinking your {provider === 'google' ? 'Google' : 'Meta'} account
						means you can no longer use it to sign in to Wanderlust.
					</p>

					<br />

					<p>
						Before continuing, make sure you've set a password or linked another
						account — otherwise you may lose access.
					</p>

					<br />

					<p>
						You may try to link your {provider === 'google' ? 'Google' : 'Meta'}{' '}
						account again later.
					</p>
				</>
			),
		});

		if (!ok) {
			return;
		}

		const res = await authClient.unlinkAccount({
			providerId: provider,
		});

		if (res.error) {
			toast.error('Failed to unlink account.');
			return;
		}

		window.location.reload();
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardAction>
					<ProviderIcon className="size-6" />
				</CardAction>
				<CardTitle>{provider === 'google' ? 'Google' : 'Meta'}</CardTitle>
			</CardHeader>
			<CardFooter>
				{confirm.Dialog}

				<Button
					variant={hasProvider ? 'destructive' : 'midnight'}
					onClick={hasProvider ? unlink : link}
				>
					{hasProvider ? 'Unlink' : 'Link'}
				</Button>
			</CardFooter>
		</Card>
	);
}
