'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Report } from '@/lib/types';
import { FormInput, useReportForm } from './use-form';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, rpc } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  report: Report;
  username: string;
};

export default function ReportForm({ report, username }: Props) {
  const form = useReportForm(report);

  const mutation = useMutation({
    mutationKey: ['reports', report.id],
    mutationFn: async (payload: any) => {
      await rpc(() => {
        return api.reports[':id'].$patch({
          param: {
            id: report.id,
          },
          json: payload,
        });
      });
    },
    onSuccess: () => {
      toast.success('Updated');
    },
    onError: (e) => {
      toast.error(`Error: ${e.message}`);
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const payload = {
      status: data.status,
      resolveComment: data.resolveComment,
      resolvedBy:
        data.status === 'resolved' || data.resolveComment !== 'undefined'
          ? username
          : undefined,
    };
    mutation.mutate(payload);
  };

  return (
    <div>
      <Button
        variant="link"
        asChild
        className="px-0"
      >
        <Link href="/dashboard/reports">
          <ChevronLeft className="size-4" />
          Back
        </Link>
      </Button>
      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="id">ID</Label>
        <Input
          type="text"
          id="id"
          value={report.id}
          disabled={true}
        />
      </div>

      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="reporterId">Reporter ID</Label>
        <Input
          type="text"
          id="reporterId"
          value={report.reporterId}
          disabled={true}
        />
      </div>

      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="targetId">Target ID</Label>
        <Input
          type="text"
          id="targetId"
          value={report.targetId}
          disabled={true}
        />
      </div>

      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="targetType">Target Type</Label>
        <Input
          type="text"
          id="targetType"
          value={report.targetType}
          disabled={true}
        />
      </div>

      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="reason">Reason</Label>
        <Input
          type="text"
          id="reason"
          value={report.reason}
          disabled={true}
        />
      </div>

      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={report.comment ?? ''}
          placeholder="Reporter comment"
          disabled={true}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 max-w-xl space-y-8"
        >
          <FormField
            control={form.control}
            name="resolvedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolved By</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Resolved By"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resolveComment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolve Comment</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={report.status === 'resolved'}
                    placeholder="Resolve Comment"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Required</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={report.status === 'resolved'}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['pending', 'in_progress', 'resolved'].map((s) => (
                      <SelectItem
                        value={s}
                        key={s}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
