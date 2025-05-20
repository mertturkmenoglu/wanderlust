import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { isBefore } from 'date-fns';
import { SquarePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const visibility = ['public', 'friends', 'private'] as const;

type Visibility = (typeof visibility)[number];

const visibilityOptions: Array<{
  label: string;
  value: Visibility;
  info: string;
}> = [
  {
    label: 'Public',
    value: 'public',
    info: 'Anyone can see your trip',
  },
  {
    label: 'Friends',
    value: 'friends',
    info: 'Only your friends can see your trip',
  },
  {
    label: 'Private',
    value: 'private',
    info: 'Only you can see your trip',
  },
];

const schema = z
  .object({
    title: z.string().min(1).max(128),
    description: z.string().min(0).max(1024),
    startAt: z.string(),
    endAt: z.string(),
    visibility: z.enum(visibility),
  })
  .superRefine((data, ctx) => {
    if (!isBefore(data.startAt, data.endAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Start date must be before end date',
        path: ['startAt'],
        fatal: true,
      });

      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Start date must be before end date',
        path: ['endAt'],
        fatal: true,
      });

      return z.NEVER;
    }

    if (isBefore(data.startAt, new Date())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be in the future',
        path: ['startAt'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

export function CreateDialog() {
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = api.useMutation('post', '/api/v2/trips/', {
    onSuccess: async (res) => {
      toast.success('Trip created');
      await invalidator.invalidate();
      await navigate({
        to: `/trips/${res.trip.id}`,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg">
          <SquarePlusIcon className="mr-2 size-4" />
          Create trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan your next trip</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm w-full">
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate({
                body: {
                  ...data,
                  startAt: new Date(data.startAt).toISOString(),
                  endAt: new Date(data.endAt).toISOString(),
                },
              });
            })}
            className="w-full"
          >
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="My Awesome Trip"
                autoComplete="off"
                className="mt-1"
                {...form.register('title')}
              />
              <InputError error={form.formState.errors.title} />
            </div>

            <div className="mt-4">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                placeholder="You can add a description for you trip."
                autoComplete="off"
                className="mt-1"
                {...form.register('description')}
              />
              <InputError error={form.formState.errors.description} />
            </div>

            <div className="mt-4">
              <Controller
                name="visibility"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div>
                      <Label htmlFor="visibility">Visibility</Label>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <SelectTrigger id="visibility" className="mt-1 w-full">
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {visibilityOptions.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputInfo
                        text={
                          visibilityOptions.find(
                            (op) => op.value === field.value,
                          )?.info ?? ''
                        }
                        className="mt-1"
                      />
                    </div>
                  );
                }}
              />
              <InputError error={form.formState.errors.visibility} />
            </div>

            <div className="mt-4">
              <Label htmlFor="startAt">Start Date</Label>
              <Input
                id="startAt"
                type="datetime-local"
                className="mt-1"
                {...form.register('startAt')}
              />
              <InputError error={form.formState.errors.startAt} />
            </div>

            <div className="mt-4">
              <Label htmlFor="endAt">End Date</Label>
              <Input
                id="endAt"
                type="datetime-local"
                placeholder='Format: "YYYY-MM-DD"'
                className="mt-1"
                {...form.register('endAt')}
              />
              <InputError error={form.formState.errors.endAt} />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                Create
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
