import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { formatDate, isFuture } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    title: z.string().min(1).max(128),
    description: z.string().min(0).max(4096),
    date: z.string(),
    shareWithFriends: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (isFuture(data.date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be in the past',
        path: ['date'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

const dateFormat = 'yyyy-MM-dd';

export const Route = createFileRoute('/diary/$id/edit/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { entry } = Route.useLoaderData();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: entry.title,
      description: entry.description,
      date: formatDate(entry.date, dateFormat),
      shareWithFriends: entry.shareWithFriends,
    },
  });

  const isPublic = form.watch('shareWithFriends');

  return (
    <div className="my-8">
      <h3
        className="text-lg"
        id="diary-information"
      >
        Edit Diary Information
      </h3>

      <Form {...form}>
        <form className="w-full md:max-w-2xl">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My Awesome Trip to Italy in 2022"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your trip"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {lengthTracker(form.watch('description'), 4096)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="mt-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shareWithFriends"
            render={({ field }) => (
              <FormItem className="mt-4">
                <div className="flex items-center gap-2">
                  <FormLabel>Share With Friends</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  {isPublic ? (
                    <InputInfo text="Friends can see this diary entry." />
                  ) : (
                    <InputInfo text="Only you can see this diary entry. Any user added to this entry will be removed." />
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4"
            disabled={!form.formState.isDirty}
          >
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
