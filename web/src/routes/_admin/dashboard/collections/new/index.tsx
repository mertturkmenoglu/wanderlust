import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomEditor from '../-custom-editor';

const schema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().min(1).max(4096),
});

export const Route = createFileRoute('/_admin/dashboard/collections/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = api.useMutation('post', '/api/v2/collections/', {
    onSuccess: async () => {
      toast.success('Collection created');
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/collections',
      });
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: 'New',
            href: '/dashboard/collections/new',
          },
        ]}
      />

      <Separator className="my-2" />

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
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
          <InputInfo text={(form.watch('name')?.length ?? 0) + '/128'} />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <CustomEditor
            value={form.watch('description')}
            setValue={(md) => form.setValue('description', md)}
          />

          <InputInfo
            text={(form.watch('description')?.length ?? 0) + '/4096'}
          />
          <InputError error={form.formState.errors.description} />
        </div>

        <div className="flex items-center justify-end gap-2 col-span-full">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              navigate({
                to: '/dashboard/collections',
              });
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
