import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getCategories } from "~/lib/api";

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

  return (
    <div>
      <BackLink
        href="/dashboard/categories"
        text="Go back to categories page"
      />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{category.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link to={`/dashboard/categories/${category.id}/edit`}>Edit</Link>
        </Button>
      </div>
      <img
        src={category.image}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex gap-2 mt-4">
        <div className="font-semibold">Category Id:</div>
        <div>{category.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Category Name:</div>
        <div>{category.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image URL:</div>
        <div>{category.image}</div>
      </div>
    </div>
  );
}
