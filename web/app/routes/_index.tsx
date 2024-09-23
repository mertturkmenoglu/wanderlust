import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import ActionBanner from "~/components/blocks/action-banner";
import OverlayBanner from "~/components/blocks/overlay-banner";
import VerticalBanner from "~/components/blocks/vertical-banner";
import { Button } from "~/components/ui/button";
import { getFeaturedCities } from "~/lib/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Wanderlust" },
    {
      name: "description",
      content: "Inspiring explorations, one spark of Wanderlust!",
    },
  ];
};

export const loader = async () => {
  const res = await getFeaturedCities();
  return json({ cities: res.data.cities });
};

export default function Page() {
  const { cities } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto">
      <OverlayBanner
        image="https://images.unsplash.com/photo-1524168272322-bf73616d9cb5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Wanderlust Banner Image"
        message="Inspiring explorations, one spark of Wanderlust!"
        className="my-8"
      />

      <div className="flex items-baseline">
        <h2 className=" text-4xl font-bold">Discover Cities</h2>
        <Button asChild variant="link">
          <Link to="/cities/list">See all</Link>
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {cities.map((city) => (
          <Link
            to={`/cities/${city.id}/${city.name}`}
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

      <OverlayBanner
        image="https://images.unsplash.com/photo-1607388510015-c632e99da586?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Categories Banner Image"
        message={
          <div className="flex items-center gap-4">
            <div>Discover the world around you</div>
            <Button asChild variant="default">
              <Link to="/categories">See categories</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName="aspect-[3]"
      />

      <VerticalBanner
        image="https://i.imgur.com/Y3ujIqE.jpg"
        alt="Discover Around You Banner Image"
        content={
          <>
            <div className="text-center">
              <h2 className="mt-8 font-serif text-3xl font-bold text-black/80">
                Discover new locations around you
              </h2>
              <p className="font-serif text-muted-foreground">
                Find new places to explore and enjoy with your friends and
                family.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8">
                <Link to="/nearby">Start Exploring</Link>
              </Button>
            </div>
          </>
        }
      />

      <ActionBanner
        image="https://i.imgur.com/mWzmPRv.jpg"
        alt="Trip Planner Banner Image"
        message={
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-primary">
              Plan your next trip
            </div>
            <div className="text-sm text-muted-foreground">
              Plan your next trip with our trip planner tool. It&apos;s easy to
              use and you can save your trips for later.
            </div>
            <Button asChild variant="default">
              <Link to="/trip/planner">Go to Trip Planner</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName=""
      />

      <ActionBanner
        image="https://i.imgur.com/CNtFbZT.jpg"
        alt="Events Banner Image"
        message={
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-primary">
              Explore Upcoming Events
            </div>
            <div className="text-sm text-muted-foreground">
              Check out the upcoming events in your area. You can also add your
              own events to the list.
            </div>
            <Button asChild variant="secondary">
              <Link to="/discover/events">See events</Link>
            </Button>
          </div>
        }
        className="my-8"
        imgClassName=""
        lefty={false}
      />
    </div>
  );
}
