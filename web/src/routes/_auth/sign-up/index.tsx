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
import { useFeatureFlags } from '@/providers/flags-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'At least 3 characters' })
    .max(128, { message: 'Value is too long' }),
  username: z
    .string()
    .min(4, { message: 'At least 4 characters' })
    .max(32, { message: 'Value is too long' }),
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const Route = createFileRoute('/_auth/sign-up/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const flags = useFeatureFlags();
  const showOAuthButtons = flags['allow-oauth-logins'] === true;

  const { formState, register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const registerMutation = api.useMutation(
    'post',
    '/api/v2/auth/credentials/register',
    {
      onSuccess: () => {
        globalThis.window.location.href = '/sign-in';
      },
    },
  );

  return (
    <Card className="mx-auto my-32 flex max-w-lg flex-col p-8">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-12 min-h-12 min-w-12"
      />
      <h2 className="mt-4 text-xl font-bold">Create Your Wanderlust Account</h2>
      <div className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <AuthLink
          href="/sign-in"
          text="Sign In"
        />
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          registerMutation.mutate({
            body: data,
          });
        })}
        className="mt-8 w-full"
      >
        <Label htmlFor="full-name">Full Name</Label>
        <Input
          type="text"
          id="full-name"
          placeholder="Your name"
          autoComplete="name"
          {...register('fullName')}
        />
        <InputError error={formState.errors.fullName} />
        <div className="my-4" />

        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          {...register('email')}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4" />

        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          autoComplete="username"
          {...register('username')}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4" />

        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            className="pr-10"
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
          <div className="my-4" />
        </div>

        <Button
          variant="default"
          className="w-full"
          type="submit"
        >
          Sign Up
        </Button>

        <Separator className="my-4" />

        {showOAuthButtons && (
          <div className="space-y-4">
            <OAuthButton
              provider="google"
              text="Sign up with Google"
            />
            <OAuthButton
              provider="facebook"
              text="Sign up with Facebook"
            />
          </div>
        )}

        <div className="mt-4 text-center">
          <AuthLegalText type="signup" />
        </div>
      </form>
    </Card>
  );
}
