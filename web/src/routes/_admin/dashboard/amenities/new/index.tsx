import { createFileRoute } from '@tanstack/react-router';
import type { SubmitHandler } from 'react-hook-form';
import { useNewAmenityForm, useNewAmenityMutation } from './-hooks';
import type { FormInput } from './-schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputInfo from '@/components/kit/input-info';
import InputError from '@/components/kit/input-error';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_admin/dashboard/amenities/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useNewAmenityForm();
  const mutation = useNewAmenityMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate({
      body: data,
    });
  };

  return (
    <div>
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Amenity
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
          <InputInfo text="Name" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div></div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
