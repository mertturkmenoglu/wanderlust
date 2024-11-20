import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import uppyCoreStyles from "@uppy/core/dist/style.min.css?url";
import uppyDashboardStyles from "@uppy/dashboard/dist/style.min.css?url";
import uppyFileInputStyles from "@uppy/file-input/dist/style.css?url";
import uppyImageEditorStyles from "@uppy/image-editor/dist/style.min.css?url";
import leafletIconCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import invariant from "tiny-invariant";
import yarlStyles from "yet-another-react-lightbox/styles.css?url";
import CollapsibleText from "~/components/blocks/collapsible-text";
import { GeneralErrorBoundary } from "~/components/blocks/error-boundary";
import { getPoiById } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import Amenities from "./components/amenities";
import BookmarkButton from "./components/bookmark-button";
import Breadcrumb from "./components/breadcrumb";
import Carousel from "./components/carousel";
import FavoriteButton from "./components/favorite-button";
import InformationTable from "./components/info-table";
import MapContainer from "./components/map-container";
import Menu from "./components/menu";
import NearbyPois from "./components/nearby-pois";
import Reviews from "./components/reviews/index";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const res = await getPoiById(params.id, {
    headers: { Cookie: getCookiesFromRequest(request) },
  });

  return json({
    poi: res.data,
    meta: res.meta,
    baseApiUrl: import.meta.env.VITE_API_URL ?? "",
    searchApiKey: import.meta.env.VITE_SEARCH_CLIENT_API_KEY ?? "",
    searchApiUrl: import.meta.env.VITE_SEARCH_CLIENT_URL ?? "",
  });
}

export function links() {
  return [
    { rel: "stylesheet", href: leafletStyles },
    { rel: "stylesheet", href: leafletIconCompatStyles },
    { rel: "stylesheet", href: uppyCoreStyles },
    { rel: "stylesheet", href: uppyDashboardStyles },
    { rel: "stylesheet", href: uppyFileInputStyles },
    { rel: "stylesheet", href: uppyImageEditorStyles },
    { rel: "stylesheet", href: yarlStyles },
  ];
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
  const { poi } = useLoaderData<typeof loader>();

  return (
    <main className="max-w-7xl mx-auto mt-8 md:mt-16">
      <Breadcrumb />

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-32">
        <Carousel />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-2 scroll-m-20 text-4xl font-extrabold capitalize tracking-tight">
              {poi.name}
            </h2>

            <div className="flex items-center">
              <FavoriteButton />

              <BookmarkButton />

              <Menu />
            </div>
          </div>

          <p className="mt-2 text-sm text-primary">{poi.category.name}</p>
          <CollapsibleText text={poi.description} />
          <h2 className="mt-8 text-lg font-bold">Information</h2>
          <InformationTable />
        </div>
      </div>

      <div className="w-full">
        <MapContainer />
      </div>

      <hr className="my-4" />

      <Amenities />

      <hr className="my-4" />

      <NearbyPois />

      <hr className="my-4" />

      <Reviews />
    </main>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
