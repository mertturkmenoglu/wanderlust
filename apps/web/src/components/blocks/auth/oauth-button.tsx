import { FacebookIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';

type Props = {
  provider: 'google' | 'facebook';
  text: string;
};

export function OAuthButton({ provider, text }: Readonly<Props>) {
  const baseUrl = env.VITE_API_URL;

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        globalThis.window.location.href = baseUrl + `/api/v2/auth/${provider}`;
      }}
      type="button"
    >
      {provider === 'google' && <GoogleIcon className="mr-2 size-5" />}
      {provider === 'facebook' && <FacebookIcon className="mr-2 size-5" />}
      {text}
    </Button>
  );
}
