import { useLoaderData } from "@remix-run/react";
import { StarIcon } from "lucide-react";
import FormattedRating from "~/components/kit/formatted-rating";
import { Progress } from "~/components/ui/progress";
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

      <div className="lg:col-span-2 space-y-2">
        {[5, 4, 3, 2, 1].map((i) => (
          <div key={i} className="flex items-center text-right gap-2">
            <div className="flex items-center gap-1 w-8 justify-end text-primary text-sm font-medium">
              {i} <StarIcon className="size-3 fill-primary text-primary" />
            </div>
            <Progress value={i * 20} className="max-w-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}
