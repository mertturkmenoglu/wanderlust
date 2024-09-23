import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCategories } from "~/lib/api";

export const loader = async () => {
  const res = await getCategories();
  return json({ categories: res.data.categories });
};

export default function Page() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto">
      <div className="flex items-baseline">
        <h2 className="mt-8 text-4xl font-bold">Browse by category</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <a
            href={`/categories/${category.id}/${category.name}`}
            key={category.id}
            className="rounded-md"
          >
            <img
              src={category.image}
              alt=""
              className="aspect-video w-full rounded-md object-cover"
            />
            <div className="mt-2 text-xl font-bold lg:text-base">
              {category.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
