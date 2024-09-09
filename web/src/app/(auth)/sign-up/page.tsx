'use client';

import Logo from '@/app/icon.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import AuthLink from '../_components/auth-link';
import OAuthButton from '../_components/oauth-button';
import { useSignUpForm, useSignUpMutation } from './hooks';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { formState, register, handleSubmit } = useSignUpForm();
  const mutation = useSignUpMutation();

  return (
    <Card className="container mx-auto my-32 flex max-w-lg flex-col py-8">
      <Image
        src={Logo}
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
        onSubmit={handleSubmit((_data) => mutation.mutate(_data))}
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
        <div className="my-4"></div>

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

        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          autoComplete="username"
          {...register('username')}
        />
        <InputError error={formState.errors.email} />
        <div className="my-4"></div>

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
          <div className="my-4"></div>
        </div>

        <Button
          variant="default"
          className="w-full"
          type="submit"
        >
          Sign Up
        </Button>

        <Separator className="my-4" />

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
      </form>
    </Card>
  );
}