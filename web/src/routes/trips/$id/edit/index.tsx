import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
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
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import { AlertTriangleIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeleteButton } from './-delete-button';
import { asVisibility, schema, visibilityOptions } from './-schema';

export const Route = createFileRoute('/trips/$id/edit/')({
  component: RouteComponent,
});

const datetimeFormat = "yyyy-MM-dd'T'HH:mm";

function RouteComponent() {
  const rootRoute = getRouteApi('/trips/$id');
  const { trip } = rootRoute.useLoaderData();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      description: trip.description,
      startAt: formatDate(trip.startAt, datetimeFormat),
      endAt: formatDate(trip.endAt, datetimeFormat),
      visibility: asVisibility(trip.visibilityLevel),
      title: trip.title,
    },
  });

  const updateTripMutation = api.useMutation('patch', '/api/v2/trips/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Trip updated');
    },
  });

  return (
    <div>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateTripMutation.mutate({
            params: {
              path: {
                id: trip.id,
              },
            },
            body: {
              title: data.title,
              description: data.description,
              visibilityLevel: data.visibility,
              startAt: new Date(data.startAt).toISOString(),
              endAt: new Date(data.endAt).toISOString(),
            },
          });
        })}
        className="w-full flex flex-col"
      >
        <DeleteButton className="self-end mt-4" />

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
                      visibilityOptions.find((op) => op.value === field.value)
                        ?.info ?? ''
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

        <div className="mt-4 flex items-center">
          <div className="text-muted-foreground text-xs max-w-sm flex gap-2">
            <AlertTriangleIcon className="size-6 text-yellow-400" />
            If you change start or end date, we will automatically move the
            locations to the new date range.
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="ml-auto"
            asChild
          >
            <Link
              to="/trips/$id"
              params={{
                id: trip.id,
              }}
            >
              Cancel
            </Link>
          </Button>
          <Button type="submit" size="sm" variant="default" className="ml-2">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
