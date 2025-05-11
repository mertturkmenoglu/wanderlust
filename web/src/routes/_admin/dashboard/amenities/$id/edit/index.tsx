import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(64),
});

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
  const navigate = useNavigate();

  if (!amenity) {
    throw new Response('Amenity not found', { status: 404 });
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: amenity.name,
    },
  });

  const mutation = api.useMutation('patch', '/api/v2/amenities/{id}', {
    onSuccess: () => {
      toast.success('Amenity updated');
      navigate({ to: `/dashboard/amenities/${id}` });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Amenities', href: '/dashboard/amenities' },
          {
            name: amenity.name,
            href: `/dashboard/amenities/${amenity.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/amenities/${amenity.id}/edit`,
          },
        ]}
      />
      <Separator className="my-2" />

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
            params: {
              path: {
                id: amenity.id,
              },
            },
            body: data,
          });
        })}
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

        <div className="flex items-center gap-2">
          <Button type="submit">Update</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: `/dashboard/amenities/$id`,
                params: {
                  id,
                },
              });
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
