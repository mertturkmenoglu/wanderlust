import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { SubmitHandler } from 'react-hook-form';
import DashboardBreadcrumb from '../../-dashboard-breadcrumb';
import { useNewAmenityForm, useNewAmenityMutation } from './-hooks';
import type { FormInput } from './-schema';

export const Route = createFileRoute('/_admin/dashboard/amenities/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useNewAmenityForm();
  const mutation = useNewAmenityMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate({
      body: data,
    });
  };

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Amenities', href: '/dashboard/amenities' },
          {
            name: 'New',
            href: '/dashboard/amenities/new',
          },
        ]}
      />
      <Separator className="my-2" />

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
          <InputInfo text="Name" />
          <InputError error={form.formState.errors.name} />
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
                to: '/dashboard/amenities',
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
