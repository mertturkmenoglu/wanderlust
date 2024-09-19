import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import api from '@/lib/api';
import { GetCityByIdResponseDto } from '@/lib/dto';

type Props = {
  params: {
    slug: string[];
  };
};

async function getCity(id: string) {
  return api.get(`cities/${id}`).json<{ data: GetCityByIdResponseDto }>();
}

export default async function Page({ params: { slug } }: Readonly<Props>) {
  if (!slug || slug.length < 1) {
    throw new Error('404: Invalid city id');
  }

  const cityId = slug[0];
  const city = await getCity(cityId);

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Discover</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cities">Cities</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{city.data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-8">
        <img
          src={city.data.imageUrl}
          alt=""
          className="mt-8 max-w-md rounded-md object-cover"
        />

        <div>
          <h2 className="mt-8 text-6xl font-bold">{city.data.name}</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {city.data.stateName}/{city.data.countryName}
          </div>
          <div className="mt-4 text-lg text-muted-foreground">
            {city.data.description}
          </div>
        </div>
      </div>
    </div>
  );
}
