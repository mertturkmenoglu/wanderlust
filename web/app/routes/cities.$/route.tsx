import leafletCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { Link } from "react-router";
import Collection from "~/components/blocks/collection";
import OverlayBanner from "~/components/blocks/overlay-banner";
import { Button } from "~/components/ui/button";
import { getCityById } from "~/lib/api";
import { ipx } from "~/lib/img-proxy";
import type { Route } from "./+types/route";
import CityBreadcrumb from "./components/city-breadcrumb";
import ImageAttributionPopover from "./components/image-attribution-popover";
import MapContainer from "./components/map-container";

export async function loader({ params }: Route.LoaderArgs) {
  let slug = params["*"];

  if (!slug) {
    throw new Response("Slug is missing", { status: 404 });
  }

  const cityId: string | undefined = slug.split("/")[0];

  if (!cityId) {
    throw new Response("City ID is missing", { status: 404 });
  }

  const city = await getCityById(cityId);

  return { city: city.data };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: `${data?.city.name} | Wanderlust` },
    {
      name: "description",
      content: `Discover ${data?.city.name} with Wanderlust`,
    },
  ];
}

export function links(): Route.LinkDescriptors {
  return [
    { rel: "stylesheet", href: leafletStyles },
    { rel: "stylesheet", href: leafletCompatStyles },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { city } = loaderData;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <CityBreadcrumb cityName={city.name} />

      <div className="grid grid-cols-5 gap-8 mt-8">
        <div className="col-span-5 lg:col-span-2">
          <div className="">
            <img
              src={ipx(city.imageUrl, "f_webp,w_1024")}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="rounded-md object-cover aspect-video"
            />

            <ImageAttributionPopover
              imageAttribute={city.imageAttribute}
              imageAttributionLink={city.imageAttributionLink}
              imageLicense={city.imageLicense}
              imageLicenseLink={city.imageLicenseLink}
            />
          </div>
        </div>

        <div className="col-span-5 lg:col-span-3">
          <h2 className="text-6xl font-bold">{city.name}</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {city.stateName}/{city.countryName}
          </div>
          <div className="mt-4 text-lg text-muted-foreground">
            {city.description}
          </div>
        </div>
      </div>

      <MapContainer lat={city.latitude} lng={city.longitude} />

      <OverlayBanner
        image="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Categories Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Plan a trip to {city.name}</div>
            <Button asChild variant="default">
              <Link to="/trips/planner">Start Planning</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <Collection
        className="my-8"
        title="Curated Locations"
        actions={
          <Button asChild variant="link">
            <Link to={`/collections/city/curated/${city.id}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: "0",
            title: "Squirrels Out",
            category: "Historical Landmark",
            favorite: true,
            image:
              "https://a.ltrbxd.com/resized/film-poster/4/7/5/3/7/0/475370-knives-out-0-1000-0-1500-crop.jpg?v=7da76d742c",
          },
          {
            id: "1",
            title: "Anatomy of a Squirrel",
            category: "Restaurant",
            favorite: true,
            image: "https://i.imgur.com/5F9jdqG.jpg",
          },
          {
            id: "2",
            title: "All Quiet on the Western Squirrels",
            category: "Bookstores",
            favorite: false,
            image: "https://i.imgur.com/SnP70MO.jpg",
          },
          {
            id: "3",
            title: "Sincap Coffee",
            category: "Coffee Shops",
            favorite: true,
            image: "https://i.imgur.com/JYnxkQM.jpg",
          },
        ]}
      />

      <OverlayBanner
        image={city.imageUrl}
        alt={`${city.name} image`}
        message={
          <div className="flex items-center gap-4">
            <div>See all locations in {city.name}</div>
            <Button asChild variant="default">
              <Link
                to={`/search?pois[refinementList][poi.City.Name][0]=${city.name}`}
              >
                Discover
              </Link>
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
          <Button asChild variant="link">
            <Link to={`/collections/city/curated/${city.id}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: "0",
            title: "Squirrel Runner 2049",
            category: "Historical Landmark",
            favorite: true,
            image:
              "https://a.ltrbxd.com/resized/film-poster/2/6/5/4/3/9/265439-blade-runner-2049-0-1000-0-1500-crop.jpg?v=86735e0bb8",
          },
          {
            id: "1",
            title: "The Squirrel's Speech",
            category: "Breweries",
            favorite: true,
            image:
              "https://a.ltrbxd.com/resized/film-poster/5/3/6/3/5363-the-king-s-speech-0-1000-0-1500-crop.jpg?v=334f06fd89",
          },
          {
            id: "4",
            title: "No Time to Squirrel",
            category: "Photography Spots",
            favorite: false,
            image: "https://i.imgur.com/XFG5Q7R.jpg",
          },
          {
            id: "5",
            title: "Squirrel's Gambit",
            category: "Restaurant",
            favorite: true,
            image: "https://i.imgur.com/FKlIkC5.jpg",
          },
        ]}
      />

      <Collection
        className="my-8"
        title="Popular Tourist Attractions"
        actions={
          <Button asChild variant="link">
            <Link to={`/collections/city/curated/${city.id}`}>See more</Link>
          </Button>
        }
        items={[
          {
            id: "2",
            title: "The Squirrel from Earth",
            category: "Museums",
            favorite: false,
            image: "https://i.imgur.com/1mn0i08.jpg",
          },
          {
            id: "3",
            title: "Squirrel Gump",
            category: "Famous Filming Locations",
            favorite: true,
            image: "https://i.imgur.com/f6VKpRj.jpg",
          },
          {
            id: "4",
            title: "The Grand Squirrel Hotel",
            category: "Hotels",
            favorite: false,
            image: "https://i.imgur.com/Ivsxi5b.jpg",
          },
          {
            id: "5",
            title: "The Squirrel of The Opera",
            category: "Theaters",
            favorite: true,
            image: "https://i.imgur.com/FKlIkC5.jpg",
          },
        ]}
      />
    </div>
  );
}
