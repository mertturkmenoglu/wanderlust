import FbIcon from '@/components/icons/facebook';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';

type Props = {
  provider: 'google' | 'facebook';
  text: string;
};

export default function OAuthButton({ provider, text }: Readonly<Props>) {
  const baseUrl = import.meta.env.VITE_API_URL ?? '';

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        window.location.href = baseUrl + `/api/v2/auth/${provider}`;
      }}
      type="button"
    >
      {provider === 'google' && <GoogleIcon className="mr-2 size-5" />}
      {provider === 'facebook' && <FbIcon className="mr-2 size-5" />}
      {text}
    </Button>
  );
}
