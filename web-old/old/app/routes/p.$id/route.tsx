import uppyCoreStyles from "@uppy/core/dist/style.min.css?url";
import uppyDashboardStyles from "@uppy/dashboard/dist/style.min.css?url";
import uppyFileInputStyles from "@uppy/file-input/dist/style.css?url";
import uppyImageEditorStyles from "@uppy/image-editor/dist/style.min.css?url";
import leafletIconCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import Lightbox, { ThumbnailsRef } from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import CollapsibleText from "~/components/blocks/collapsible-text";
import { GeneralErrorBoundary } from "~/components/blocks/error-boundary";
import { getPoiById } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import Amenities from "./components/amenities";
import BookmarkButton from "./components/bookmark-button";
import Breadcrumb from "./components/breadcrumb";
import FavoriteButton from "./components/favorite-button";
import InformationTable from "./components/info-table";
import MapContainer from "./components/map-container";
import Menu from "./components/menu";
import NearbyPois from "./components/nearby-pois";
import Reviews from "./components/reviews/index";

export async function loader({ request, params }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  const res = await getPoiById(params.id, {
    headers: { Cookie: getCookiesFromRequest(request) },
  });

  return {
    poi: res.data,
    meta: res.meta,
    baseApiUrl: import.meta.env.VITE_API_URL ?? "",
    searchApiKey: import.meta.env.VITE_SEARCH_CLIENT_API_KEY ?? "",
    searchApiUrl: import.meta.env.VITE_SEARCH_CLIENT_URL ?? "",
  };
}

export function links(): Route.LinkDescriptors {
  return [
    { rel: "stylesheet", href: leafletStyles },
    { rel: "stylesheet", href: leafletIconCompatStyles },
    { rel: "stylesheet", href: uppyCoreStyles },
    { rel: "stylesheet", href: uppyDashboardStyles },
    { rel: "stylesheet", href: uppyFileInputStyles },
    { rel: "stylesheet", href: uppyImageEditorStyles },
  ];
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  if (!data) {
    return [{ title: "Poi Not Found " }];
  }

  return [
    { title: `${data.poi.name} | Wanderlust` },
    { name: "description", content: data.poi.description },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { poi } = loaderData;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const ref = useRef<ThumbnailsRef>(null);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  return (
    <main className="max-w-7xl mx-auto mt-8 md:mt-16">
      <Breadcrumb />

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-32">
        <div className="h-min w-full lg:w-full">
          <Lightbox
            index={index}
            slides={poi.media.map((m) => ({
              src: m.url,
            }))}
            className=""
            plugins={[Inline, Thumbnails]}
            thumbnails={{
              ref: ref,
              vignette: false,
              imageFit: "cover",
              border: 0,
              borderColor: "#FFF",
            }}
            on={{
              view: updateIndex,
              click: toggleOpen(true),
            }}
            carousel={{
              padding: 0,
              spacing: 0,
              imageFit: "cover",
            }}
            styles={{
              container: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
              thumbnailsContainer: {
                backgroundColor: "rgba(0, 0, 0, 0.0)",
              },
              thumbnail: {
                backgroundColor: "rgba(0, 0, 0, 0.0)",
              },
            }}
            inline={{
              className: "w-min h-min w-11/12 lg:w-full",
              style: {
                maxWidth: "900px",
                aspectRatio: "1/1",
                margin: "0 auto",
              },
            }}
          />

          <Lightbox
            open={open}
            close={toggleOpen(false)}
            index={index}
            slides={poi.media.map((m) => ({
              src: m.url,
            }))}
            on={{ view: updateIndex }}
            animation={{ fade: 0 }}
            controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
            styles={{
              container: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          />
        </div>

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
