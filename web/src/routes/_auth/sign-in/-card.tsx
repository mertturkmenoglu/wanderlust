import { AuthLegalText } from '@/components/blocks/auth/legal-text';
import { AuthLink } from '@/components/blocks/auth/link';
import { OAuthButton } from '@/components/blocks/auth/oauth-button';
import { InputError } from '@/components/kit/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useFeatureFlags } from '@/providers/flags-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  isModal: boolean;
};

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function SignInCard({ isModal }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const flags = useFeatureFlags();
  const showOAuthButtons = flags['allow-oauth-logins'] === true;

  const { formState, register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = api.useMutation(
    'post',
    '/api/v2/auth/credentials/login',
    {
      onSuccess: () => {
        globalThis.window.location.href = '/';
        globalThis.window.location.search = '';
      },
    },
  );

  return (
    <Card
      className={cn('mx-auto my-8 flex flex-col ', {
        'max-w-lg p-8 my-32': !isModal,
        'shadow-none border-none': isModal,
      })}
    >
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-12 min-h-16 min-w-16"
      />
      <h2 className="mt-4 text-xl font-bold">Sign in to Wanderlust</h2>
      <div className="text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <AuthLink
          href="/sign-up"
          text="Sign Up"
        />
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          loginMutation.mutate({
            body: data,
          });
        })}
        className="mt-4 w-full"
      >
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          className="mt-1"
          {...register('email')}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4" />

        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            className="pr-10 mt-1"
            {...register('password')}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? (
              <EyeIcon className="size-4" />
            ) : (
              <EyeOffIcon className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center">
          <InputError
            error={formState.errors.password}
            className="self-start"
          />
          <AuthLink
            href="/forgot-password"
            text="Forgot password?"
            className="ml-auto"
          />
        </div>

        <div className="my-4" />

        <Button
          variant="default"
          className="w-full"
          type="submit"
        >
          Sign In
        </Button>

        <Separator className="my-4" />

        {showOAuthButtons && (
          <div className="space-y-4">
            <OAuthButton
              provider="google"
              text="Sign in with Google"
            />
            <OAuthButton
              provider="facebook"
              text="Sign in with Facebook"
            />
          </div>
        )}

        <div className="mt-4 text-center">
          <AuthLegalText type="signin" />
        </div>
      </form>
    </Card>
  );
}
