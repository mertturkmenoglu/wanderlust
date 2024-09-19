import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { GetCitiesResponseDto } from '@/lib/dto';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCities() {
  return api.get('cities/').json<{ data: GetCitiesResponseDto }>();
}

export default async function Home() {
  const { data } = await getCities();

  return (
    <div className="container">
      <div className="flex items-baseline">
        <h2 className="mt-16 text-4xl font-bold">Discover Cities</h2>
        <Button
          asChild
          variant="link"
        >
          <Link
            href="/cities"
            className=""
          >
            See all
          </Link>
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {data.cities.map((city) => (
          <Link
            href={`/cities/${city.id}/${city.name}`}
            key={city.id}
            className="rounded-md"
          >
            <img
              src={city.imageUrl}
              alt=""
              className="aspect-video w-full rounded-md object-cover"
            />
            <div className="mt-2 text-xl font-bold lg:text-base">
              {city.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
