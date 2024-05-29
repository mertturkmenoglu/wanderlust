import EmptyContent from "@/components/blocks/EmptyContent";

import { api, rpc } from "@/lib/api";
import Breadcrumb from "./_components/breadcrumb";
import Carousel from "./_components/carousel";
import InformationTable from "./_components/information-table";
import LocationMap from "./_components/location-map";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

async function getLocation(id: string) {
  return rpc(() =>
    api.locations[":id"].$get({
      param: {
        id,
      },
    })
  );
}

export default async function Page({ params: { id } }: Props) {
  const location = await getLocation(id);

  return (
    <main className="container mt-16">
      <Breadcrumb
        categoryId={location.category.id}
        categoryName={location.category.name}
        locationName={location.name}
      />

      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-32">
        <Carousel media={location.media} />

        <div>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight capitalize mt-8">
            {location.name}
          </h2>
          <p className="mt-2 text-sm text-gray-500">{location.category.name}</p>
          <p className="mt-2 text-sm text-gray-500">{location.description}</p>
          <h2 className="mt-8 text-lg font-bold">Information</h2>
          <InformationTable location={location} />
        </div>
      </div>

      <LocationMap location={location} />

      <hr className="my-8" />

      {/* reviews */}
      <h2 className="text-2xl font-bold">Reviews</h2>

      <EmptyContent className="mt-16" showBackButton={false} />
    </main>
  );
}