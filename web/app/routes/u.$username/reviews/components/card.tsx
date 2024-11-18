import { Link } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import FormattedRating from "~/components/kit/formatted-rating";
import { Separator } from "~/components/ui/separator";
import { GetReviewByIdResponseDto } from "~/lib/dto";

type Props = {
  review: GetReviewByIdResponseDto;
  isLast: boolean;
};

export default function Card({ review, isLast }: Props) {
  return (
    <Link to={`/p/${review.poiId}`} className="block space-y-4">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center">
          <span className="hidden md:block">Reviewed </span>
          <span className="text-primary mx-4">{review.poi.name}</span>
          <FormattedRating
            rating={review.rating}
            votes={1}
            showNumbers={false}
            starsClassName="size-3"
          />
          <span className="ml-2 text-sm">{review.rating} stars</span>
          <span className="ml-2 text-xs hidden md:block">
            {review.content.slice(0, 20) + "..."}
          </span>
        </div>
        <span className="text-sm">
          {formatDistanceToNow(review.createdAt)} ago
        </span>
      </div>
      {!isLast && <Separator />}
    </Link>
  );
}
