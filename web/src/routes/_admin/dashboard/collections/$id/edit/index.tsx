import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomEditor from '../../-custom-editor';

const schema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().min(1).max(4096),
});

type FormInput = z.infer<typeof schema>;

export const Route = createFileRoute('/_admin/dashboard/collections/$id/edit/')(
  {
    component: RouteComponent,
    loader: async ({ context, params }) => {
      return context.queryClient.ensureQueryData(
        api.queryOptions('get', '/api/v2/collections/{id}', {
          params: {
            path: {
              id: params.id,
            },
          },
        }),
      );
    },
  },
);

function RouteComponent() {
  const { collection } = Route.useLoaderData();
  const invalidator = useInvalidator();
  const navigate = useNavigate();

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: collection,
  });

  const mutation = api.useMutation('patch', '/api/v2/collections/{id}', {
    onSuccess: async () => {
      toast.success('Collection updated');
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/collections/$id',
        params: {
          id: collection.id,
        },
      });
    },
    onError: (e) => {
      toast.error(e.title ?? 'Something went wrong');
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate({
      params: {
        path: {
          id: collection.id,
        },
      },
      body: data,
    });
  };

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: collection.name,
            href: `/dashboard/collections/${collection.id}`,
          },
          {
            name: 'Edit',
            href: `/dashboard/collections/${collection.id}/edit`,
          },
        ]}
      />

      <Separator className="my-2" />

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input type="text" id="id" value={collection.id} disabled />
          <InputInfo text="You cannot change the ID of the collection" />
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
          <InputInfo text={lengthTracker(form.watch('name'), 128)} />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <CustomEditor
            value={form.watch('description')}
            setValue={(md) => form.setValue('description', md)}
          />
          <InputInfo text={lengthTracker(form.watch('description'), 4096)} />
          <InputError error={form.formState.errors.description} />
        </div>

        <div className="flex items-center justify-end gap-2 col-span-full">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: `/dashboard/collections/${collection.id}`,
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
