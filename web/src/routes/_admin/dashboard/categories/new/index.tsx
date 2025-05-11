import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useNewCategoryForm, useNewCategoryMutation } from './-hooks';

export const Route = createFileRoute('/_admin/dashboard/categories/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [previewUrl, setPreviewUrl] = useState('');
  const form = useNewCategoryForm();
  const mutation = useNewCategoryMutation();

  return (
    <div>
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Category
      </h3>

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

        <div className="mt-8">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
