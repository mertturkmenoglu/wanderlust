import InputInfo from '@/components/kit/input-info';
import Spinner from '@/components/kit/spinner';
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
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from '@tanstack/react-router';
import { formatDate, isFuture } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
});

function RouteComponent() {
  const route = getRouteApi('/diary/$id/edit');
  const { diary } = route.useLoaderData();
  const invalidator = useInvalidator();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: diary.title,
      description: diary.description,
      date: formatDate(diary.date, dateFormat),
      shareWithFriends: diary.shareWithFriends,
    },
  });

  const isPublic = form.watch('shareWithFriends');

  const updateDiaryMutation = api.useMutation('patch', '/api/v2/diary/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Diary updated successfully.');
    },
  });

  const deleteDiaryMutation = api.useMutation('delete', '/api/v2/diary/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Diary deleted successfully.');
      navigate({
        to: '/diary',
      });
    },
  });

  return (
    <div className="my-8">
      <div className="flex items-start gap-4 justify-between w-full md:max-w-2xl">
        <h3
          className="text-lg"
          id="diary-information"
        >
          Edit Diary Information
        </h3>

        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this diary?')) {
              deleteDiaryMutation.mutate({
                params: {
                  path: {
                    id: diary.id,
                  },
                },
              });
            }
          }}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </Button>
      </div>

      <Form {...form}>
        <form
          className="w-full md:max-w-2xl"
          onSubmit={form.handleSubmit((data) => {
            updateDiaryMutation.mutate({
              params: {
                path: {
                  id: diary.id,
                },
              },
              body: {
                ...data,
                date: new Date(data.date).toISOString(),
              },
            });
          })}
        >
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
                    placeholder="Write like you're talking to a friend"
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
                    <InputInfo text="Friends can see this diary." />
                  ) : (
                    <InputInfo text="Only you can see this diary. Any user added to this entry will be removed." />
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4"
            disabled={updateDiaryMutation.isPending}
          >
            {updateDiaryMutation.isPending ? (
              <Spinner className="mr-2" />
            ) : (
              'Update'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
