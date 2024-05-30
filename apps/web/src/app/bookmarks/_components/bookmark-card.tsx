import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bookmark } from '@/lib/types';

type Props = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark: { location } }: Props) {
  return (
    <Card className="group flex flex-col md:flex-row">
      <img
        src={location.media.slice(0, 1)[0].url}
        alt={location.media.slice(0, 1)[0].alt}
        className="aspect-video w-full rounded-t-md object-cover md:w-32 md:rounded-none md:rounded-l-md lg:w-32 2xl:w-64"
      />

      <div>
        <CardHeader>
          <CardTitle className="line-clamp-1 capitalize">
            {location.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {location.address.city} / {location.address.state}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-1 text-sm leading-none">
            {location.category.name}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
