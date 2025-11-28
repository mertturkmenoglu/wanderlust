// oxlint-disable prefer-await-to-then
import { AppMessage } from '@/components/blocks/app-message';
import { Spinner } from '@/components/kit/spinner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const searchSchema = z.object({
  id: z.string().catch(''),
  type: z.string().catch(''),
});

const formSchema = z.object({
  resourceId: z.string().min(1),
  resourceType: z.string().min(1),
  description: z.string().min(1).max(256),
  reason: z.string().min(1),
});

const reasons = [
  {
    id: '1',
    name: 'Spam',
  },
  {
    id: '2',
    name: 'Inappropriate',
  },
  {
    id: '3',
    name: 'Fake',
  },
  {
    id: '4',
    name: 'Other',
  },
];

export const Route = createFileRoute('/report/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { id, type } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceId: id,
      resourceType: type,
    },
  });

  const mutation = api.useMutation('post', '/api/v2/reports/', {
    onSuccess: () => {
      toast.success('Reported successfully');
      setSubmitted(true);
    },
  });

  if (id === '' || type === '') {
    return (
      <AppMessage
        emptyMessage="Select a resource and report it"
        backLink="/"
        backLinkText="Back to home"
        showBackButton
      />
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-16">
        <AppMessage
          successMessage="Thank you for reporting this content."
          backLink="/"
          backLinkText="Back to home"
          showBackButton
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate({
              body: {
                ...data,
                reason: +data.reason,
              },
            });
          })}
        >
          <h2 className="text-xl font-semibold text-center">Report</h2>
          <div className="mt-2 text-sm text-center text-muted-foreground">
            Thank you for taking the time to report unwanted content on
            Wanderlust.
          </div>
          <FormField
            control={form.control}
            name="resourceId"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Resource ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Resource ID"
                    type="text"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormDescription>We filled this value for you.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resourceType"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Resource Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Resource Type"
                    type="text"
                    className="capitalize"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormDescription>We filled this value for you.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Reason</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem
                        key={reason.id}
                        value={reason.id}
                      >
                        {reason.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    placeholder="Describe your report"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add a description for your report.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner className="size-4 mx-auto" />}
            Report
          </Button>
        </form>
      </Form>
    </div>
  );
}
