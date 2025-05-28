import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  address: z.object({
    cityId: z.number().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    postalCode: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export const Route = createFileRoute(
  '/_admin/dashboard/pois/$id/edit/address/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const invalidator = useInvalidator();
  const {
    data: { cities },
  } = api.useSuspenseQuery('get', '/api/v2/cities/');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address: {
        cityId: poi.address.cityId,
        line1: poi.address.line1,
        line2: poi.address.line2 ?? undefined,
        postalCode: poi.address.postalCode ?? undefined,
        lat: poi.address.lat,
        lng: poi.address.lng,
      },
    },
  });

  const updateAddressMutation = api.useMutation(
    'patch',
    '/api/v2/pois/{id}/address',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Address updated');
      },
    },
  );

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">
        Edit Point of Interest Address
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateAddressMutation.mutate({
              params: {
                path: {
                  id: poi.id,
                },
              },
              body: {
                ...data.address,
                line2: data.address.line2 ?? null,
                postalCode: data.address.postalCode ?? null,
              },
            });
          })}
          className="mt-8 grid grid-cols-1 gap-4 px-0 mx-auto md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="address.cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem
                        key={city.id}
                        value={city.id.toString()}
                      >
                        {city.name}, {city.state.name}, {city.country.name}
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
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Postal Code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address Line 1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address Line 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex justify-end">
            <Button disabled={updateAddressMutation.isPending}>
              {updateAddressMutation.isPending && (
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
