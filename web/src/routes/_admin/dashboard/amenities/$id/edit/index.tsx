import BackLink from '@/components/blocks/back-link';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import type { SubmitHandler } from 'react-hook-form';
import { useUpdateAmenityForm, useUpdateAmenityMutation } from './-hooks';
import type { FormInput } from './-schema';

export const Route = createFileRoute('/_admin/dashboard/amenities/$id/edit/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/amenities/'),
    ),
});

function RouteComponent() {
  const { amenities } = Route.useLoaderData();
  const { id } = Route.useParams();
  const amenity = amenities.find((amenity) => amenity.id === +id);

  if (!amenity) {
    throw new Response('Amenity not found', { status: 404 });
  }

  const form = useUpdateAmenityForm({
    name: amenity.name,
  });

  const mutation = useUpdateAmenityMutation(amenity.id);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate({
      params: {
        path: {
          id: amenity.id,
        },
      },
      body: data,
    });
  };

  return (
    <div>
      <BackLink
        href={`/dashboard/amenities/${amenity.id}`}
        text="Go back to amenity details"
      />
      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register('name')}
          />
          <InputInfo text="Name of the amenity" />
          <InputError error={form.formState.errors.name} />
        </div>
        <div></div>

        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
