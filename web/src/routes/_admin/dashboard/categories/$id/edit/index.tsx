import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(64),
  image: z.string().min(1).max(256),
});

export const Route = createFileRoute('/_admin/dashboard/categories/$id/edit/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/categories/'),
    ),
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const category = categories.find((category) => category.id === +id)!;
  const [previewUrl, setPreviewUrl] = useState(category.image);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: category,
  });

  const mutation = api.useMutation('patch', '/api/v2/categories/{id}', {
    onSuccess: async () => {
      toast.success('Category updated');
      navigate({ to: `/dashboard/categories/${id}`, reloadDocument: true });
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Categories', href: '/dashboard/categories' },
          {
            name: category.name,
            href: `/dashboard/categories/${category.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/categories/${category.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <img
        src={ipx(previewUrl, 'w_512')}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <form
        className="max-w-xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0"
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
            params: {
              path: {
                id: category.id,
              },
            },
            body: data,
          });
        })}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input
            type="text"
            id="id"
            value={category.id}
            disabled
          />
          <InputInfo text="You cannot change the ID of the category" />
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
          <InputInfo text="Name of the amenity" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="url"
            id="image"
            placeholder="https://example.com/image.jpg"
            autoComplete="off"
            {...form.register('image')}
          />
          <InputInfo text="Image URL for the category" />
          <InputError error={form.formState.errors.image} />
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => setPreviewUrl(form.watch('image'))}
          >
            Preview
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit">Update</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: `/dashboard/categories/$id`,
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
