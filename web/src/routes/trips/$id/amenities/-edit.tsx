import AppMessage from '@/components/blocks/app-message';
import InputError from '@/components/kit/input-error';
import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  amenities: z.array(z.number()).optional(),
});

export function EditAmenities() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const query = api.useQuery('get', '/api/v2/amenities/');
  const amenities = query.data?.amenities ?? [];
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: trip.requestedAmenities.map((a) => a.id),
    },
  });

  const mutation = api.useMutation('patch', '/api/v2/trips/{id}/amenities', {
    onSuccess: async () => {
      await invalidator.invalidate();
      form.reset();
      toast.success('Amenities updated successfully');
    },
  });

  if (query.isPending) {
    return <Spinner className="my-8 mx-auto size-8" />;
  }

  if (query.isError) {
    return (
      <AppMessage
        errorMessage="Failed to load amenities"
        showBackButton={false}
        className="my-8"
      />
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
      onSubmit={form.handleSubmit((data) => {
        mutation.mutate({
          params: {
            path: {
              id: trip.id,
            },
          },
          body: {
            amenityIds: data.amenities ?? [],
          },
        });
      })}
    >
      <div className="col-span-2">
        <Controller
          name="amenities"
          control={form.control}
          render={() => {
            return (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-2">
                {amenities.map((amenity) => (
                  <Controller
                    key={amenity.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={field.value?.includes(amenity.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value ?? []),
                                    amenity.id,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== amenity.id,
                                    ),
                                  );
                            }}
                          />

                          <Label className="font-normal">{amenity.name}</Label>
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
            );
          }}
        />
        <InputError error={form.formState.errors.amenities?.root} />
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="col-span-full"
      >
        Save
      </Button>
    </form>
  );
}
