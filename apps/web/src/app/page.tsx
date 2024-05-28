import CategoryNavigation from "@/components/blocks/CategoryNavigation";
import UpcomingEvents from "@/components/blocks/UpcomingEvents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, rpc } from "@/lib/api";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 6;

async function peekLocations() {
  return await rpc(() => api.locations.peek.$get());
}

export default async function Home() {
  const data = await peekLocations();

  return (
    <main className="">
      <nav className="mx-auto flex justify-center my-12 items-center space-x-4">
        <input
          className="border border-muted-foreground w-10/12 lg:w-1/2 py-4 rounded-full px-8"
          placeholder="Search a location or an event"
        />

        <Button size="icon" className="rounded-full size-12">
          <MagnifyingGlassIcon className="size-6" />
        </Button>
      </nav>

      <CategoryNavigation />

      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tighter lg:text-3xl text-accent-foreground mt-12">
        Upcoming Events
      </h2>

      <UpcomingEvents />

      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tighter lg:text-3xl text-accent-foreground mt-12">
        New Locations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 my-8">
        {data.map((location) => (
          <Link key={location.id} href={`/location/${location.id}`}>
            <Card key={location.id} className="group">
              <img
                src={location.media.slice(0, 1)[0].url}
                alt={location.media.slice(0, 1)[0].alt}
                className="aspect-video rounded-t-xl w-full object-cover"
                width={512}
                height={288}
              />

              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <CardDescription>
                  {location.address.city} / {location.address.state}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-none">
                    {location.category.name}
                  </p>
                  <div className="flex items-center gap-2 pt-4 flex-wrap">
                    {location.tags.map((tag) => (
                      <Badge key={tag} className="text-xs capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
