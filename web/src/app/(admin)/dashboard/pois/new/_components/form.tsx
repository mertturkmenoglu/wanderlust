'use client';

import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import InputInfo from '@/components/ui/input-info';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNewPoiForm } from './hooks';

export default function NewPoiForm() {
  const form = useNewPoiForm();

  return (
    <div>
      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(console.log)}
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
          <InputInfo text="Name of the point of interest" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div></div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of the point of interest"
            rows={4}
            autoComplete="off"
            {...form.register('description')}
          />
          <InputInfo text="Description of the point of interest" />
          <InputError error={form.formState.errors.description} />
        </div>
      </form>
    </div>
  );
}
