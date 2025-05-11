import BackLink from '@/components/blocks/back-link';
import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
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
    onError: async (e) => {
      toast.error(e.title ?? 'Something went wrong');
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    mutation.mutate({
      body: data,
    });
  };

  return (
    <div>
      <BackLink
        href="/dashboard/collections"
        text="Go back to collections page"
      />
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Collection
      </h3>

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

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
