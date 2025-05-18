import InputError from '@/components/kit/input-error';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { ConciergeBellIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  amenities: z.array(z.number()).optional(),
});

export function AmenitiesDialog() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();
  const query = api.useQuery('get', '/api/v2/amenities/');
  const amenities = query.data?.amenities ?? [];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: trip.requestedAmenities.map((a) => a.id),
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <ConciergeBellIcon className="size-4" />
          <span className="">Amenities</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:min-w-3xl lg:min-w-4xl xl:min-w-7xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Requested Amenities</AlertDialogTitle>
          <form
            className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
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

                                <Label className="font-normal">
                                  {amenity.name}
                                </Label>
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
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
