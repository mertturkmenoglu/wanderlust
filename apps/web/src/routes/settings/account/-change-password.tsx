import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/lib/api';
import { normalizeMultipleErrors } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' })
      .max(128, { message: 'Password is too long' }),
    newPassword: z
      .string()
      .min(8, { message: 'At least 8 characters' })
      .max(128, { message: 'Password is too long' })
      .superRefine((data, ctx) => {
        let flag = false;
        if (data.includes(' ')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password cannot contain spaces',
          });
          flag = true;
        }

        if (!/[A-Z]/.test(data)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one uppercase letter',
          });
          flag = true;
        }

        if (!/[a-z]/.test(data)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one lowercase letter',
          });
          flag = true;
        }

        if (!/[0-9]/.test(data)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one number',
          });
          flag = true;
        }

        if (!/[^A-Za-z0-9]/.test(data)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one special character',
          });
          flag = true;
        }

        if (flag) {
          return z.NEVER;
        }

        return true;
      }),
    confirmPassword: z.string().min(1).max(128),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['newPassword'],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });

      return z.NEVER;
    }

    return true;
  });

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    criteriaMode: 'all',
  });

  const mutation = api.useMutation('post', '/api/v2/auth/password/change', {
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        mutation.mutate({
          body: data,
        });
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="current-password"
                  placeholder="Current Password"
                  autoComplete="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  autoComplete="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
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

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="confirm-password"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
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

        <Button
          type="submit"
          className="mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Spinner />}
          <span>Change Password</span>
        </Button>
      </FieldGroup>
    </form>
  );
}
