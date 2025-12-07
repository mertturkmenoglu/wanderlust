import { Button } from '@wanderlust/ui/components/button';
import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { authClient } from '@/lib/auth';

type Props = {
	provider: 'google' | 'facebook';
	text: string;
};

export function OAuthButton({ provider, text }: Readonly<Props>) {
	return (
		<Button
			variant="outline"
			className="w-full"
			onClick={async () => {
				authClient.signIn.social({
					provider,
					callbackURL: window.location.origin,
				});
			}}
			type="button"
		>
			{provider === 'google' && <GoogleIcon className="mr-2 size-5" />}
			{provider === 'facebook' && <FacebookIcon className="mr-2 size-5" />}
			{text}
		</Button>
	);
}
