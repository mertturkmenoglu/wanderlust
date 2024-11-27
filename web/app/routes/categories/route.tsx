import { Link } from "react-router";
import { getCategories } from "~/lib/api";
import { ipx } from "~/lib/img-proxy";
import type { Route } from "./+types/route";

export async function loader() {
  const res = await getCategories();
  return { categories: res.data.categories };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Categories | Wanderlust" }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-baseline">
        <h2 className="mt-8 text-4xl font-bold">Browse by category</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            to={`/search?pois[refinementList][poi.Category.Name][0]=${category.name}`}
            key={category.id}
            className="rounded-md"
          >
            <img
              src={ipx(category.image, "w_512")}
              alt=""
              className="aspect-video w-full rounded-md object-cover"
            />
            <div className="mt-2 text-xl font-bold lg:text-base">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
