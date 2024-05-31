import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api, rpc } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function peekLocations() {
  return await rpc(() => api.locations.peek.$get());
}

export default async function NewLocations() {
  const data = await peekLocations();

  return (
    <>
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
                          className="text-nowrap text-xs capitalize"
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
    </>
  );
}
