import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DashboardBreadcrumb from '../../../../../components/blocks/dashboard/breadcrumb';

const schema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
});

export const Route = createFileRoute('/_admin/dashboard/categories/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = api.useMutation('post', '/api/v2/categories/', {
    onSuccess: () => {
      toast.success('Category created');
      navigate({ to: '/dashboard/categories' });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Categories', href: '/dashboard/categories' },
          {
            name: 'New',
            href: '/dashboard/categories/new',
          },
        ]}
      />
      <Separator className="my-2" />

      {previewUrl !== '' && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-8 w-64 rounded-md aspect-video object-cover"
        />
      )}

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit((data) =>
          mutation.mutate({
            body: data,
          }),
        )}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input
            type="number"
            id="id"
            placeholder="ID of the category"
            autoComplete="off"
            {...form.register('id', { valueAsNumber: true })}
          />
          <InputInfo text="ID of the category" />
          <InputError error={form.formState.errors.id} />
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
          <InputInfo text="Name" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="text"
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

        <div></div>

        <div className="flex items-center gap-2">
          <Button type="submit">Create</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: '/dashboard/categories',
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
