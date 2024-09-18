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
      <h2 className="mt-16 text-4xl font-bold">Discover Cities</h2>
      <div className="mt-4 flex gap-4">
        {data.cities.map((city) => (
          <Link
            href={`/cities/${city.id}/${city.name}`}
            key={city.id}
            className="rounded-md"
          >
            <img
              src={city.imageUrl}
              alt=""
              className="aspect-video w-64 rounded-md object-cover"
            />
            <div className="mt-2 font-bold">{city.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
