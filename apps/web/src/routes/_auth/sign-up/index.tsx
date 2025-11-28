import { AuthLegalText } from '@/components/blocks/auth/legal-text';
import { AuthLink } from '@/components/blocks/auth/link';
import { OAuthButton } from '@/components/blocks/auth/oauth-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useFeatureFlags } from '@/providers/flags-provider';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useSignUpForm, useSignUpMutation } from './-hooks';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { normalizeMultipleErrors } from '@/lib/form';

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

  const form = useSignUpForm();
  const mutation = useSignUpMutation();

  return (
    <Card className="mx-auto my-32 flex max-w-lg flex-col p-8 gap-2">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-16 min-h-16 min-w-16"
      />
      <h2 className="mt-4 text-xl font-bold">Create Your Wanderlust Account</h2>
      <div className="text-sm text-muted-foreground -mt-2">
        Already have an account?{' '}
        <AuthLink
          href="/sign-in"
          text="Sign In"
        />
      </div>
      <form
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
            body: data,
          });
        })}
        className="w-full mt-4"
      >
        <FieldGroup className="gap-4">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="full-name"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  placeholder="Email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...field}
                  id="username"
                  placeholder="Username"
                  autoComplete="username"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="password"
                    placeholder="Password"
                    aria-invalid={fieldState.invalid}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError
                    errors={normalizeMultipleErrors(fieldState.error?.types)}
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          variant="default"
          className="w-full mt-4"
          type="submit"
          disabled={!form.formState.isValid || mutation.isPending}
        >
          {mutation.isPending && <Spinner />}
          <span>Sign Up</span>
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
