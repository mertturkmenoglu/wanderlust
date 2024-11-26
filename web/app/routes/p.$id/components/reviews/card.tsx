import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import CollapsibleText from "~/components/blocks/collapsible-text";
import UserImage from "~/components/blocks/user-image";
import FormattedRating from "~/components/kit/formatted-rating";
import { GetReviewByIdResponseDto } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import { cn } from "~/lib/utils";
import { Menu } from "./menu";

type Props = {
  review: GetReviewByIdResponseDto;
};

export function ReviewCard({ review }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="px-8">
      <div className="flex flex-row items-center gap-4">
        <UserImage
          className="size-16 rounded-full"
          src={review.user.profileImage ?? ""}
        />
        <div>
          <div className="font-medium">{review.user.fullName}</div>
          <div className="text-xs text-primary tracking-tight">
            <span className="">@{review.user.username}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{`${formatDistanceToNow(
            review.createdAt
          )} ago`}</div>
        </div>
        <div className="ml-auto">
          <Menu review={review} />
        </div>
      </div>
      <div className="mt-4">
        <CollapsibleText text={review.content} charLimit={512} />
        <div
          className={cn("flex items-center gap-4", {
            "mt-4": review.media.length > 0,
          })}
        >
          {review.media.map((m, i) => (
            <button
              key={m.url}
              onClick={() => {
                setIndex(() => {
                  setOpen(true);
                  return i;
                });
              }}
            >
              <img
                src={ipx(m.url, "w_96")}
                alt=""
                className="aspect-square rounded"
              />
            </button>
          ))}
        </div>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={review.media.map((m) => ({
            src: m.url,
          }))}
          carousel={{
            finite: true,
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          styles={{
            container: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
          }}
          index={index}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FormattedRating
            rating={review.rating}
            votes={1}
            showNumbers={false}
          />
          <span className="text-sm font-semibold">{review.rating}.0</span>
        </div>
        <Link
          to={`/report?type=review&id=${review.id}`}
          className="text-xs text-muted-foreground flex items-center ml-auto hover:underline"
        >
          <FlagIcon className="size-3" />
          <span className="ml-2">Report</span>
        </Link>
      </div>
    </div>
  );
}
