import CategoryNavigation from '@/components/blocks/CategoryNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api, rpc } from '@/lib/api';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function peekLocations() {
  return await rpc(() => api.locations.peek.$get());
}

export default async function Home() {
  const data = await peekLocations();

  return (
    <main className="">
      <nav className="mx-auto my-12 flex items-center justify-center space-x-4">
        <input
          className="w-10/12 rounded-full border border-muted-foreground px-8 py-4 lg:w-1/2"
          placeholder="Search a location or an event"
        />

        <Button
          size="icon"
          className="size-12 rounded-full"
        >
          <MagnifyingGlassIcon className="size-6" />
        </Button>
      </nav>

      <CategoryNavigation />

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tighter text-accent-foreground lg:text-3xl">
        New Locations
      </h2>

      <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((location) => (
          <Link
            key={location.id}
            href={`/location/${location.id}`}
          >
            <Card
              key={location.id}
              className="group"
            >
              <img
                src={location.media.slice(0, 1)[0].url}
                alt={location.media.slice(0, 1)[0].alt}
                className="aspect-video w-full rounded-t-xl object-cover"
                width={512}
                height={288}
              />

              <CardHeader>
                <CardTitle className="line-clamp-1 capitalize">
                  {location.name}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  {location.address.city} / {location.address.state}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-none">
                    {location.category.name}
                  </p>
                  <ScrollArea>
                    <ul className="my-4 flex items-center gap-2">
                      {location.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="text-xs capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </ul>

                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
