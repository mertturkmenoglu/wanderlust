import { GetPoiByIdResponseDto, Media } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import { cn } from "~/lib/utils";

type Props = {
  poi: Pick<GetPoiByIdResponseDto, "id" | "name" | "category" | "address"> & {
    image: Pick<Media, "url" | "alt">;
  };
} & React.HTMLAttributes<HTMLDivElement> &
  Pick<React.ComponentProps<"img">, "fetchPriority" | "loading">;

export default function PoiCard({
  poi,
  className,
  fetchPriority = "auto",
  loading = "eager",
  ...props
}: Props) {
  return (
    <div key={poi.id} className={cn("group", className)} {...props}>
      <img
        src={ipx(poi.image.url, "w_512")}
        alt={poi.image.alt}
        fetchPriority={fetchPriority}
        loading={loading}
        className="aspect-video w-full rounded-md object-cover"
      />

      <div className="my-2">
        <div className="mt-2 line-clamp-1 text-lg font-semibold capitalize">
          {poi.name}
        </div>
        <div className="line-clamp-1 text-sm text-muted-foreground">
          {poi.address.city.name} / {poi.address.city.countryName}
        </div>
      </div>

      <div>
        <div className="flex-1 space-y-2">
          <div className="text-sm text-primary">{poi.category.name}</div>
        </div>
      </div>
    </div>
  );
}
