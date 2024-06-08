import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Location } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  location: Location;
} & React.HTMLAttributes<HTMLDivElement>;

export default function LocationCard({ location, className, ...props }: Props) {
  const image = location.media[0];

  return (
    <Card
      key={location.id}
      className={cn('group', className)}
      {...props}
    >
      <img
        src={image.url}
        alt={image.alt}
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
          <p className="text-sm leading-none">{location.category.name}</p>
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
  );
}
