import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { getCategories } from "~/lib/api";
import type { Route } from "./+types/route";

export async function loader() {
  const categories = await getCategories();
  return { categories: categories.data.categories };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {categories.map((category) => (
          <Link to={`/dashboard/categories/${category.id}`} key={category.id}>
            <Button asChild variant="link" className="p-0">
              <div className="font-bold text-wrap">{category.name}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
