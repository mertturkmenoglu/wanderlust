import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
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
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const changePasswordMutation = api.useMutation(
    'post',
    '/api/v2/auth/password/change',
    {
      onSuccess: () => {
        toast.success('Password changed successfully.');
      },
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          changePasswordMutation.mutate({
            body: data,
          });
        })}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Current Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="New Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4"
          disabled={!form.formState.isDirty}
        >
          Change Password
        </Button>
      </form>
    </Form>
  );
}
