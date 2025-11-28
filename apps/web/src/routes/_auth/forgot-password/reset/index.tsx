import { AuthLink } from '@/components/blocks/auth/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { usePasswordResetForm, usePasswordResetMutation } from './-hooks';
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

export const Route = createFileRoute('/_auth/forgot-password/reset/')({
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
  const form = usePasswordResetForm();
  const mutation = usePasswordResetMutation();

  return (
    <Card className="mx-auto my-32 flex max-w-md flex-col p-8 gap-2">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-16 min-h-16 min-w-16"
      />
      <h2 className="mt-4 text-xl font-bold">Reset Password</h2>
      <div className="text-sm text-muted-foreground -mt-2">
        Already have an account?{' '}
        <AuthLink
          href="/sign-in"
          text="Sign In"
        />
      </div>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="mt-4 w-full"
      >
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={form.control}
            disabled={true}
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
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input
                  {...field}
                  id="code"
                  placeholder="Code"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="new-password"
                    placeholder="New Password"
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
          <span>Reset Your Password</span>
        </Button>
      </form>
    </Card>
  );
}
