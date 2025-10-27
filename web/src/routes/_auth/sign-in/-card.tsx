import { AuthLegalText } from '@/components/blocks/auth/legal-text';
import { AuthLink } from '@/components/blocks/auth/link';
import { OAuthButton } from '@/components/blocks/auth/oauth-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useFeatureFlags } from '@/providers/flags-provider';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useSignInForm, useSignInMutation } from './-hooks';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  isModal: boolean;
};

export function SignInCard({ isModal }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const flags = useFeatureFlags();
  const showOAuthButtons = flags['allow-oauth-logins'] === true;

  const form = useSignInForm();
  const mutation = useSignInMutation();

  return (
    <Card
      className={cn('mx-auto my-8 flex flex-col gap-2', {
        'max-w-lg p-8 my-32': !isModal,
        'shadow-none border-none': isModal,
      })}
    >
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-16 min-h-16 min-w-16"
      />
      <h2 className="mt-4 text-xl font-bold">Sign in to Wanderlust</h2>
      <div className="text-sm text-muted-foreground -mt-2">
        Don&apos;t have an account?{' '}
        <AuthLink
          href="/sign-up"
          text="Sign Up"
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
                    autoComplete="current-password"
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
                  <FieldError errors={[fieldState.error]} />
                )}
                <AuthLink
                  href="/forgot-password"
                  text="Forgot password?"
                  className="justify-end"
                />
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
          <span>Sign In</span>
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
