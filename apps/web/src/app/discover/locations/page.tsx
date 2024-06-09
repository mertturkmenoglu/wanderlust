import { api, rpc } from '@/lib/api';
import { categories } from '@/lib/categories';
import Link from 'next/link';

async function getCategoriesWithCount() {
  return rpc(() => api.categories.count.$get());
}

export default async function Page(): Promise<React.ReactElement> {
  const { data } = await getCategoriesWithCount();

  return (
    <main>
      <h2 className="mt-16 text-3xl font-bold tracking-tight">Categories</h2>
      <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((c) => (
          <Link
            key={c.category.id}
            href={`/search?c=${c.category.id}`}
          >
            <div className="rounded-xl border border-border">
              <img
                src={
                  categories.find((cat) => cat.id === c.category.id)?.url ?? ''
                }
                alt={c.category.name}
                className="aspect-video h-48 w-full rounded-t-lg object-cover"
              />
              <div className="p-3">
                <div className="text-xl font-bold tracking-tight">
                  {c.category.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {c.count} locations
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
