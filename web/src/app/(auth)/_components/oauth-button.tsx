import { Button } from '@/components/ui/button';
import FbIcon from '@/components/ui/fb-icon';
import GoogleIcon from '@/components/ui/google-icon';
import { useCallback } from 'react';

type Props = {
  provider: 'google' | 'facebook';
  text: string;
};

export default function OAuthButton({ provider, text }: Readonly<Props>) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const onClick = useCallback(() => {
    window.location.href = baseUrl + `auth/${provider}`;
  }, [baseUrl, provider]);

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={onClick}
      type="button"
    >
      {provider === 'google' && <GoogleIcon className="mr-2 size-5" />}
      {provider === 'facebook' && <FbIcon className="mr-2 size-5" />}
      {text}
    </Button>
  );
}
