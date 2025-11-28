import { AuthLink } from '@/components/blocks/auth/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useForgotPasswordForm, useForgotPasswordMutation } from './-hooks';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/_auth/forgot-password/')({
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
  const form = useForgotPasswordForm();
  const mutation = useForgotPasswordMutation();

  return (
    <Card className="mx-auto my-32 flex max-w-lg flex-col p-8 gap-2">
      <img
        src="/logo.png"
        alt="Wanderlust"
        className="size-16 min-h-16 min-w-16"
      />
      <h2 className="mt-4 text-xl font-bold">Forgot Password</h2>
      <div className="text-sm text-muted-foreground -mt-2">
        Already have an account?{' '}
        <AuthLink
          href="/sign-in"
          text="Sign In"
        />
      </div>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="w-full mt-4"
      >
        <FieldGroup>
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
        </FieldGroup>

        <Button
          variant="default"
          className="w-full mt-4"
          type="submit"
          disabled={!form.formState.isValid || mutation.isPending}
        >
          {mutation.isPending && <Spinner />}
          <span>Send Code</span>
        </Button>
      </form>
    </Card>
  );
}
