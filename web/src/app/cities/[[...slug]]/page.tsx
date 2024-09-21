import Collection from '@/components/blocks/collection';
import OverlayBanner from '@/components/blocks/overlay-banner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { getCityById } from '@/lib/api';
import Link from 'next/link';
import ListCities from './_components/list-cities';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: {
    slug: string[];
  };
};

export default async function Page({ params: { slug } }: Readonly<Props>) {
  if (!slug || slug.length < 1) {
    return <ListCities />;
  }

  const cityId = slug[0];
  const city = await getCityById(cityId);

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

      <div className="flex flex-col lg:flex-row lg:gap-8">
        <img
          src={city.data.imageUrl}
          alt=""
          className="mt-8 w-full rounded-md object-cover lg:max-w-md"
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

      <Collection
        className="my-8"
        title="Curated Locations"
        actions={
          <Button
            asChild
            variant="link"
          >
            <Link href={`/collections/city/curated/${cityId}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: '0',
            title: 'Squirrels Out',
            category: 'Historical Landmark',
            favorite: true,
            image:
              'https://a.ltrbxd.com/resized/film-poster/4/7/5/3/7/0/475370-knives-out-0-1000-0-1500-crop.jpg?v=7da76d742c',
          },
          {
            id: '1',
            title: 'Anatomy of a Squirrel',
            category: 'Restaurant',
            favorite: true,
            image: 'https://i.imgur.com/5F9jdqG.jpg',
          },
          {
            id: '2',
            title: 'All Quiet on the Western Squirrels',
            category: 'Bookstores',
            favorite: false,
            image: 'https://i.imgur.com/SnP70MO.jpg',
          },
          {
            id: '3',
            title: 'Sincap Coffee',
            category: 'Coffee Shops',
            favorite: true,
            image: 'https://i.imgur.com/JYnxkQM.jpg',
          },
        ]}
      />

      <OverlayBanner
        image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Categories Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Plan a trip to {city.data.name}</div>
            <Button
              asChild
              variant="default"
            >
              <Link href="/trips/planner">Start Planning</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <Collection
        className="my-8"
        title="Users Favorites"
        actions={
          <Button
            asChild
            variant="link"
          >
            <Link href={`/collections/city/curated/${cityId}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: '0',
            title: 'Squirrel Runner 2049',
            category: 'Historical Landmark',
            favorite: true,
            image:
              'https://a.ltrbxd.com/resized/film-poster/2/6/5/4/3/9/265439-blade-runner-2049-0-1000-0-1500-crop.jpg?v=86735e0bb8',
          },
          {
            id: '1',
            title: "The Squirrel's Speech",
            category: 'Breweries',
            favorite: true,
            image:
              'https://a.ltrbxd.com/resized/film-poster/5/3/6/3/5363-the-king-s-speech-0-1000-0-1500-crop.jpg?v=334f06fd89',
          },
          {
            id: '4',
            title: 'No Time to Squirrel',
            category: 'Photography Spots',
            favorite: false,
            image: 'https://i.imgur.com/XFG5Q7R.jpg',
          },
          {
            id: '5',
            title: "Squirrel's Gambit",
            category: 'Restaurant',
            favorite: true,
            image: 'https://i.imgur.com/FKlIkC5.jpg',
          },
        ]}
      />

      <Collection
        className="my-8"
        title="Popular Tourist Attractions"
        actions={
          <Button
            asChild
            variant="link"
          >
            <Link href={`/collections/city/curated/${cityId}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: '2',
            title: 'The Squirrel from Earth',
            category: 'Museums',
            favorite: false,
            image: 'https://i.imgur.com/1mn0i08.jpg',
          },
          {
            id: '3',
            title: 'Squirrel Gump',
            category: 'Famous Filming Locations',
            favorite: true,
            image: 'https://i.imgur.com/f6VKpRj.jpg',
          },
          {
            id: '4',
            title: 'The Grand Squirrel Hotel',
            category: 'Hotels',
            favorite: false,
            image: 'https://i.imgur.com/Ivsxi5b.jpg',
          },
          {
            id: '5',
            title: 'The Squirrel of The Opera',
            category: 'Theaters',
            favorite: true,
            image: 'https://i.imgur.com/FKlIkC5.jpg',
          },
        ]}
      />
    </div>
  );
}
