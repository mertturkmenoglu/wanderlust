import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon, StarIcon } from "lucide-react";
import FormattedRating from "~/components/kit/formatted-rating";
import { Progress } from "~/components/ui/progress";
import { getPoiRatings } from "~/lib/api-requests";
import { GetPoiRatingsResponseDto } from "~/lib/dto";
import { computeRating } from "~/lib/rating";
import { loader } from "../../route";
import CreateReviewDialog from "./create-dialog";

export default function Header() {
  const { poi } = useLoaderData<typeof loader>();
  const rating = computeRating(poi.totalPoints, poi.totalVotes);
  const fmt = Intl.NumberFormat("en-US", {
    style: "decimal",
    compactDisplay: "short",
    notation: "compact",
  });

  const query = useQuery({
    queryKey: ["poi-ratings", poi.id],
    queryFn: async () => getPoiRatings(poi.id),
  });

  return (
    <div className="bg-gradient-to-r from-accent/50 to-primary/10 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold text-xl text-primary">Reviews</h3>
        <div className="my-2 flex items-center gap-4">
          <span className="font-bold text-6xl text-primary">
            {computeRating(poi.totalPoints, poi.totalVotes)}
          </span>
          <div>
            <FormattedRating
              rating={parseFloat(rating)}
              votes={poi.totalVotes}
              showNumbers={false}
            />
            <span className="text-xs text-muted-foreground tracking-tight">
              {fmt.format(poi.totalVotes)} reviews
            </span>
          </div>
        </div>
        <CreateReviewDialog />
      </div>

      {query.isLoading && (
        <LoaderCircleIcon className="size-16 my-auto mx-auto animate-spin text-primary" />
      )}

      {query.data && <Ratings ratings={query.data.data} />}
    </div>
  );
}

type Props = {
  ratings: GetPoiRatingsResponseDto;
};

function Ratings({ ratings }: Props) {
  const entries = Object.entries(ratings.ratings).map(
    (v) => [+v[0], v[1]] as const
  );
  const sorted = entries.sort((a, b) => b[0] - a[0]);
  const fmt = Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    style: "decimal",
    notation: "compact",
  });

  return (
    <div className="lg:col-span-2 space-y-2">
      {sorted.map(([rating, count]) => (
        <div key={rating} className="flex items-center text-right gap-2">
          <div className="flex items-center gap-1 w-8 justify-end text-primary text-sm font-medium">
            {rating} <StarIcon className="size-3 fill-primary text-primary" />
          </div>
          <Progress
            value={(count * 100) / ratings.totalVotes}
            className="max-w-xs"
          />
          <span className="text-xs text-primary tabular-nums">
            ({fmt.format(count)})
          </span>
        </div>
      ))}
    </div>
  );
}
