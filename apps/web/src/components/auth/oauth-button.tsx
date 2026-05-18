import { Button } from '@wanderlust/ui/components/button';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { authClient } from '@/lib/auth';

type Props = {
	provider: 'google' | 'facebook';
};

export function OAuthButton({ provider }: Readonly<Props>) {
	return (
		<Button
			variant="outline"
			onClick={async () => {
				authClient.signIn.social({
					provider,
					callbackURL: window.location.origin,
				});
			}}
			type="button"
			size="sm"
		>
			{provider === 'google' && <GoogleIcon className="size-4 shrink-0" />}
			{provider === 'facebook' && <FacebookIcon className="size-4 shrink-0" />}
			<span>
				<span className="capitalize">{provider}</span>
			</span>
		</Button>
	);
}
