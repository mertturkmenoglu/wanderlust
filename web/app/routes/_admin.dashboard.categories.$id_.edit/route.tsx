import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
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
        href={`/dashboard/categories/${category.id}`}
        text="Go back to category details"
      />
      <div>This is the edit page for category {category.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(category, null, 2)}
        </pre>
      </div>
    </div>
  );
}
