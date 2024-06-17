import CollapsibleText from '@/components/blocks/CollapsibleText';
import { api, rpc } from '@/lib/api';
import { getAuthHeader } from '@/lib/headers';
import BookmarkButton from './_components/bookmark-button';
import Breadcrumb from './_components/breadcrumb';
import Carousel from './_components/carousel';
import FavoriteButton from './_components/favorite-button';
import InformationTable from './_components/info/table';
import LocationMap from './_components/location-map';
import Menu from './_components/menu';
import Reviews from './_components/reviews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

async function getLocation(id: string) {
  return rpc(() =>
    api.locations[':id'].$get(
      {
        param: {
          id,
        },
      },
      getAuthHeader()
    )
  );
}

export default async function Page({ params: { id } }: Props) {
  const { data: location, metadata } = await getLocation(id);

  return (
    <main className="container mx-auto mt-8 md:mt-16">
      <Breadcrumb
        categoryId={location.category.id}
        categoryName={location.category.name}
        locationName={location.name}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-32">
        <Carousel media={location.media} />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-2 scroll-m-20 text-4xl font-extrabold capitalize tracking-tight">
              {location.name}
            </h2>

            <div className="flex items-center">
              <FavoriteButton
                isFavorite={metadata.isFavorite}
                locationId={location.id}
              />

              <BookmarkButton
                isBookmarked={metadata.isBookmarked}
                locationId={location.id}
              />

              <Menu locationId={location.id} />
            </div>
          </div>

          <p className="mt-2 text-sm text-primary">{location.category.name}</p>
          <CollapsibleText text={location.description} />
          <h2 className="mt-8 text-lg font-bold">Information</h2>
          <InformationTable location={location} />
        </div>
      </div>

      <LocationMap location={location} />

      <hr className="my-8" />

      <Reviews
        locationId={location.id}
        name={location.name}
      />
    </main>
  );
}
