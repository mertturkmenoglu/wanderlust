import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  amenities: z.array(z.number()).optional(),
});

export const Route = createFileRoute(
  '/_admin/dashboard/pois/$id/edit/amenities/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const invalidator = useInvalidator();

  const {
    data: { amenities },
  } = api.useSuspenseQuery('get', '/api/v2/amenities/');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: poi.amenities.map((amenity) => amenity.id),
    },
  });

  const updateAmenitiesMutation = api.useMutation(
    'patch',
    '/api/v2/pois/{id}/amenities',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Amenities updated');
      },
    },
  );

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">
        Edit Point of Interest Amenities
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateAmenitiesMutation.mutate({
              params: {
                path: {
                  id: poi.id,
                },
              },
              body: {
                amenityIds: data.amenities ?? [],
              },
            });
          })}
          className="mt-8 grid grid-cols-1 gap-4 px-0 mx-auto md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="amenities"
            render={() => (
              <FormItem className="col-span-full">
                <div className="mb-4">
                  <FormLabel>Amenities</FormLabel>
                  <FormDescription>
                    Select the items you want to display in the sidebar.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {amenities.map((amenity) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={amenity.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
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
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {amenity.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex justify-end">
            <Button disabled={updateAmenitiesMutation.isPending}>
              {updateAmenitiesMutation.isPending && (
                <Spinner className="size-4" />
              )}
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
