'use client';

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
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { ReportInput } from '../page';
import { reasons } from './data';
import { FormInput } from './schema';
import { useCreateReport } from './use-create-report';
import { useReportForm } from './use-report-form';

type Props = ReportInput;

export default function ReportForm(props: Props) {
  const form = useReportForm(props);
  const mutation = useCreateReport();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-4 flex max-w-2xl flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="targetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="ID of the resource"
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
          name="targetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type of the resource"
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
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <Select onValueChange={(v) => field.onChange(v)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem
                      value={r.name}
                      key={r.id}
                    >
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Give us more information about the report"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            asChild
            variant="link"
            className="px-0"
          >
            <Link href="/help">Need help? Check our help center.</Link>
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isLoading || form.formState.isSubmitting}
            className="ml-auto"
          >
            <span>Report</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
