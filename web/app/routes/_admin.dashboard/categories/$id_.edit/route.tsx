import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getCategories } from "~/lib/api";
import { useUpdateCategoryForm, useUpdateCategoryMutation } from "./hooks";
import { FormInput } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const id = +params.id;
  const categories = await getCategories();
  const category = categories.data.categories.find(
    (category) => category.id === id
  );

  if (!category) {
    throw new Response("Category not found", { status: 404 });
  }

  return json({ category });
}

export default function Page() {
  const { category } = useLoaderData<typeof loader>();
  const [previewUrl, setPreviewUrl] = useState(category.image);
  const form = useUpdateCategoryForm(category);
  const mutation = useUpdateCategoryMutation(category.id);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <BackLink
        href={`/dashboard/categories/${category.id}`}
        text="Go back to category details"
      />

      <img
        src={previewUrl}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input type="text" id="id" value={category.id} disabled />
          <InputInfo text="You cannot change the ID of the category" />
        </div>

        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register("name")}
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
            {...form.register("image")}
          />
          <InputInfo text="Image URL for the category" />
          <InputError error={form.formState.errors.image} />
          <Button
            type="button"
            variant="link"
            className="px-0"
            onClick={() => setPreviewUrl(form.watch("image"))}
          >
            Preview
          </Button>
        </div>

        <div></div>

        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
