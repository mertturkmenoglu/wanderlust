import api from '@/lib/api';
import { GetCategoriesResponseDto } from '@/lib/dto';

async function getCategories() {
  return api.get('categories/').json<{ data: GetCategoriesResponseDto }>();
}

export default async function Page() {
  const { data } = await getCategories();

  return (
    <div className="container">
      <div className="flex items-baseline">
        <h2 className="mt-8 text-4xl font-bold">Browse by category</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {data.categories.map((category) => (
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
