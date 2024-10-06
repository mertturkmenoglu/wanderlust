import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GetFavoriteByIdResponseDto } from "~/lib/dto";

type Props = {
  favorite: GetFavoriteByIdResponseDto;
};

export default function FavoriteCard({ favorite: { poi } }: Props) {
  return (
    <Card className="group flex flex-col md:flex-row">
      <img
        src={poi.media.url}
        alt={poi.media.alt}
        className="aspect-video w-full rounded-t-md object-cover md:w-32 md:rounded-none md:rounded-l-md lg:w-32 2xl:w-64"
      />

      <div>
        <CardHeader>
          <CardTitle className="line-clamp-1 capitalize">{poi.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {poi.address.city.name} / {poi.address.city.countryName}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-1 text-sm leading-none">
            {poi.category.name}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
