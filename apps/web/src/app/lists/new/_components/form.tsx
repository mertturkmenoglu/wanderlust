'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api, rpc } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(32),
  isPublic: z.boolean(),
});

type FormInput = z.infer<typeof schema>;

export default function NewListForm() {
  const qc = useQueryClient();

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      isPublic: true,
    },
  });

  const mutation = useMutation({
    mutationKey: ['profile'],
    mutationFn: async (data: FormInput) => {
      await rpc(() =>
        api.lists.$post({
          json: data,
        })
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: [''],
      });
      toast.success('Created new list. Redirecting...');
      setTimeout(() => {
        window.location.href = '/lists';
      }, 2000);
    },
    onError: () => {
      toast.error('Failed to create list');
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 max-w-xl space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of your list"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give your list a meaningful name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This is a public list</FormLabel>
                <FormDescription>
                  {field.value
                    ? 'Anyone can view this list.'
                    : 'Only you can view this list.'}{' '}
                  You can change this later.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div>
          <FormDescription>
            Create a new list to start adding items to it.
          </FormDescription>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
