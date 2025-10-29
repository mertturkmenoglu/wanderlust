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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { isBefore } from 'date-fns';
import { SquarePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const visibility = ['public', 'friends', 'private'] as const;

type Visibility = (typeof visibility)[number];

type TVisibilityOption = {
  label: string;
  value: Visibility;
  info: string;
};

const visibilityOptions: TVisibilityOption[] = [
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
  const route = getRouteApi('/trips/');
  const { showNewDialog } = route.useSearch();
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = api.useMutation('post', '/api/v2/trips/', {
    onSuccess: async (res) => {
      await invalidator.invalidate();
      await navigate({
        to: '/trips/$id',
        params: {
          id: res.trip.id,
        },
      });
      toast.success('Trip created');
    },
  });

  return (
    <Dialog
      open={showNewDialog === true}
      onOpenChange={(o) =>
        navigate({
          to: '.',
          search: (prev) => ({ ...prev, showNewDialog: o }),
        })
      }
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
        >
          <SquarePlusIcon />
          Create trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan your next trip</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm w-full">
          <form
            id="create-trip-form"
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
            <FieldGroup className="gap-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      placeholder="My Awesome Trip"
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
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="You can add a description for your trip."
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
                name="visibility"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
                      <FieldDescription>
                        {visibilityOptions.find(
                          (op) => op.value === field.value,
                        )?.info ?? 'Change who can see your trip'}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldDescription>
                    </FieldContent>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="visibility"
                        aria-invalid={fieldState.invalid}
                        className="min-w-32"
                      >
                        <SelectValue placeholder="Select a visibility" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        align="end"
                      >
                        {visibilityOptions.map((op) => (
                          <SelectItem
                            key={op.value}
                            value={op.value}
                          >
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="startAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="startAt">Start Date</FieldLabel>
                    <Input
                      {...field}
                      id="startAt"
                      aria-invalid={fieldState.invalid}
                      type="datetime-local"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endAt">End Date</FieldLabel>
                    <Input
                      {...field}
                      id="endAt"
                      aria-invalid={fieldState.invalid}
                      type="datetime-local"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            form="create-trip-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />}
            <span>Create</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
