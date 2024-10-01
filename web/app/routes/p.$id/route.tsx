import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import CollapsibleText from "~/components/blocks/collapsible-text";
import { GeneralErrorBoundary } from "~/components/blocks/error-boundary";
import { getPoiById } from "~/lib/api";
import Amenities from "./components/amenities";
import BookmarkButton from "./components/bookmark-button";
import Breadcrumb from "./components/breadcrumb";
import Carousel from "./components/carousel";
import FavoriteButton from "./components/favorite-button";
import InformationTable from "./components/info-table";
import { Map } from "./components/map.client";
import Menu from "./components/menu";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const Cookie = request.headers.get("Cookie") ?? "";

  const res = await getPoiById(params.id, { headers: { Cookie } });

  return json({
    poi: res.data,
    meta: res.meta,
  });
}

export function meta({ data }: MetaArgs<typeof loader>) {
  if (!data) {
    return [{ title: "Poi Not Found " }];
  }

  return [
    { title: `${data.poi.name} | Wanderlust` },
    { name: "description", content: data.poi.description },
  ];
}

export default function Page() {
  const { poi, meta } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto mt-8 md:mt-16">
      <Breadcrumb
        categoryId={poi.categoryId}
        categoryName={poi.category.name}
        poiName={poi.name}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-32">
        <Carousel media={poi.media} />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-2 scroll-m-20 text-4xl font-extrabold capitalize tracking-tight">
              {poi.name}
            </h2>

            <div className="flex items-center">
              <FavoriteButton isFavorite={meta.isFavorite} poiId={poi.id} />

              <BookmarkButton isBookmarked={meta.isBookmarked} poiId={poi.id} />

              <Menu poiId={poi.id} />
            </div>
          </div>

          <p className="mt-2 text-sm text-primary">{poi.category.name}</p>
          <CollapsibleText text={poi.description} />
          <h2 className="mt-8 text-lg font-bold">Information</h2>
          <InformationTable poi={poi} />
        </div>
      </div>

      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <Map lat={poi.address.lat} lng={poi.address.lng} />}
      </ClientOnly>

      <Amenities amenities={poi.amenities} />

      <hr className="my-8" />
      {/* <Reviews locationId={location.id} name={location.name} /> */}
    </main>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
