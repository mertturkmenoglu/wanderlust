import AuthLegalText from '@/components/blocks/auth/legal-text';
import AuthLink from '@/components/blocks/auth/link';
import OAuthButton from '@/components/blocks/auth/oauth-button';
import InputError from '@/components/kit/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { fetchClient } from '@/lib/api';
import { AuthContext } from '@/providers/auth-provider';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useLoginMutation, useSignInForm } from './-hooks';
import type { FormInput } from './-schema';

export const Route = createFileRoute('/_auth/sign-in')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');
    if (res.data !== undefined) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  const auth = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const { formState, register, handleSubmit } = useSignInForm();
  const mutation = useLoginMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  if (!auth.isLoading && auth.user !== null) {
    window.location.href = '/';
  }

  return (
    <Card className="mx-auto my-32 flex max-w-lg flex-col p-8">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-12 min-h-12 min-w-12"
      />
      <h2 className="mt-4 text-xl font-bold">Sign in to Wanderlust</h2>
      <div className="text-sm text-muted-foreground">
        Don&apos;t have an account? <AuthLink href="/sign-up" text="Sign Up" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          {...register('email')}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4"></div>

        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            autoComplete="current-password"
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
          <AuthLink
            href="/forgot-password"
            text="Forgot password?"
            className="ml-auto"
          />
        </div>

        <div className="my-4"></div>

        <Button variant="default" className="w-full" type="submit">
          Sign In
        </Button>

        <Separator className="my-4" />

        <div className="space-y-4">
          <OAuthButton provider="google" text="Sign in with Google" />
          <OAuthButton provider="facebook" text="Sign in with Facebook" />
        </div>

        <div className="mt-4 text-center">
          <AuthLegalText type="signin" />
        </div>
      </form>
    </Card>
  );
}
