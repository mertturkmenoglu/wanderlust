import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DashboardBreadcrumb from '../../../-dashboard-breadcrumb';

const schema = z.object({
  name: z.string().min(1).max(64),
  stateCode: z.string().min(1).max(16),
  stateName: z.string().min(1).max(64),
  countryCode: z.string().length(2),
  countryName: z.string().min(1).max(64),
  imageUrl: z.string().min(1).max(256),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(1).max(1024),
  imageLicense: z.string().min(1).max(32).nullable(),
  imageLicenseLink: z.string().min(1).max(256).nullable(),
  imageAttribute: z.string().min(1).max(256).nullable(),
  imageAttributionLink: z.string().min(1).max(256).nullable(),
});

export const Route = createFileRoute('/_admin/dashboard/cities/$id/edit/')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/cities/{id}', {
        params: {
          path: {
            id: +params.id,
          },
        },
      }),
    ),
});

function RouteComponent() {
  const city = Route.useLoaderData();
  const [previewUrl, setPreviewUrl] = useState(city.image.url);
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...city,
      imageAttribute: city.image.attribution,
      imageAttributionLink: city.image.attributionLink,
      imageLicense: city.image.license,
      imageLicenseLink: city.image.licenseLink,
      latitude: city.coordinates.latitude,
      longitude: city.coordinates.longitude,
      stateCode: city.state.code,
      stateName: city.state.name,
      countryCode: city.country.code,
      countryName: city.country.name,
      imageUrl: city.image.url,
    },
  });

  const mutation = api.useMutation('patch', '/api/v2/cities/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/cities/$id',
        params: {
          id: `${city.id}`,
        },
      });

      toast.success('City updated');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Cities', href: '/dashboard/cities' },
          {
            name: city.name,
            href: `/dashboard/cities/${city.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/categories/${city.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <img
        src={ipx(previewUrl, 'w_512')}
        alt={city.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
            params: {
              path: {
                id: city.id,
              },
            },
            body: {
              ...data,
              imageLicense: data.imageLicense ?? '',
              imageLicenseLink: data.imageLicenseLink ?? '',
              imageAttribute: data.imageAttribute ?? '',
              imageAttributionLink: data.imageAttributionLink ?? '',
            },
          });
        })}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input type="text" id="id" value={city.id} disabled />
          <InputInfo text="You cannot change the ID of the city" />
        </div>

        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register('name')}
          />
          <InputInfo text="Name of the city" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="">
          <Label htmlFor="state-code">State Code</Label>
          <Input
            type="text"
            id="state-code"
            placeholder="State Code"
            autoComplete="off"
            {...form.register('stateCode')}
          />
          <InputInfo text="State Code" />
          <InputError error={form.formState.errors.stateCode} />
        </div>

        <div className="">
          <Label htmlFor="state-name">State Name</Label>
          <Input
            type="text"
            id="state-name"
            placeholder="State Name"
            autoComplete="off"
            {...form.register('stateName')}
          />
          <InputInfo text="State Name" />
          <InputError error={form.formState.errors.stateName} />
        </div>

        <div className="">
          <Label htmlFor="country-code">Country Code</Label>
          <Input
            type="text"
            id="country-code"
            placeholder="Country Code"
            autoComplete="off"
            {...form.register('countryCode')}
          />
          <InputInfo text="Country Code" />
          <InputError error={form.formState.errors.countryCode} />
        </div>

        <div className="">
          <Label htmlFor="country-name">Country Name</Label>
          <Input
            type="text"
            id="country-name"
            placeholder="Country Name"
            autoComplete="off"
            {...form.register('countryName')}
          />
          <InputInfo text="Country Name" />
          <InputError error={form.formState.errors.countryName} />
        </div>

        <div className="">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="url"
            id="image"
            placeholder="https://example.com/image.jpg"
            autoComplete="off"
            {...form.register('imageUrl')}
          />
          <InputInfo text={(form.watch('imageUrl')?.length ?? 0) + '/255'} />
          <InputError error={form.formState.errors.imageUrl} />
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => setPreviewUrl(form.watch('imageUrl'))}
          >
            Preview
          </Button>
        </div>

        <div></div>

        <div className="">
          <Label htmlFor="image-license">Image License</Label>
          <Input
            type="text"
            id="image-license"
            placeholder="Image License"
            autoComplete="off"
            {...form.register('imageLicense')}
          />
          <InputInfo text="Image License (e.g. CC v3)" />
          <InputError error={form.formState.errors.imageLicense} />
        </div>

        <div className="">
          <Label htmlFor="image-license-link">Image License Link</Label>
          <Input
            type="text"
            id="image-license-link"
            placeholder="Image License Link"
            autoComplete="off"
            {...form.register('imageLicenseLink')}
          />
          <InputInfo text="Link to image license" />
          <InputError error={form.formState.errors.imageLicense} />
        </div>

        <div className="">
          <Label htmlFor="image-attribute">Image Attribute</Label>
          <Input
            type="text"
            id="image-attribute"
            placeholder="Image Attribute"
            autoComplete="off"
            {...form.register('imageAttribute')}
          />
          <InputInfo text="Attribution to original work" />
          <InputError error={form.formState.errors.imageAttribute} />
        </div>

        <div className="">
          <Label htmlFor="image-attribution-link">Image Attribution Link</Label>
          <Input
            type="text"
            id="image-attribution-link"
            placeholder="Image Attribution Link"
            autoComplete="off"
            {...form.register('imageAttributionLink')}
          />
          <InputInfo text="Link to original work" />
          <InputError error={form.formState.errors.imageAttributionLink} />
        </div>

        <div />
        <div />

        <div className="">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            type="number"
            id="lat"
            step="any"
            placeholder="Latitude"
            autoComplete="off"
            {...form.register('latitude', { valueAsNumber: true })}
          />
          <InputInfo text="Latitude" />
          <InputError error={form.formState.errors.latitude} />
        </div>

        <div className="">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            type="number"
            id="lng"
            step="any"
            placeholder="Longitude"
            autoComplete="off"
            {...form.register('longitude', { valueAsNumber: true })}
          />
          <InputInfo text="Longitude" />
          <InputError error={form.formState.errors.longitude} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="Description of the city"
            autoComplete="off"
            rows={6}
            {...form.register('description')}
          />
          <InputInfo text="Description of the city" />
          <InputError error={form.formState.errors.description} />
        </div>

        <div className="flex items-center justify-end gap-2 col-span-full">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: '/dashboard/cities/$id',
                params: {
                  id: `${city.id}`,
                },
              });
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
