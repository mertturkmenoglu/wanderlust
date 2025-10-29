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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { isAfter } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    title: z.string().min(1).max(128),
    date: z.string(),
  })
  .superRefine((data, ctx) => {
    if (isAfter(data.date, new Date())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be in the past',
        path: ['date'],
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

  const mutation = api.useMutation('post', '/api/v2/diary/', {
    onSuccess: async (res) => {
      toast.success('Diary entry created');
      await invalidator.invalidate();
      await navigate({
        to: `/diary/${res.diary.id}`,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon className="mr-2 size-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new diary entry</DialogTitle>
        </DialogHeader>

        <form
          id="create-diary-entry-form"
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate({
              body: {
                title: data.title,
                date: new Date(data.date).toISOString(),
              },
            });
          })}
        >
          <FieldGroup className="gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="entry-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="entry-title"
                    placeholder="Italy Trip with the family in 2022"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="entry-date">Date</FieldLabel>
                  <Input
                    {...field}
                    id="entry-date"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            form="create-diary-entry-form"
            type="submit"
            variant="default"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
