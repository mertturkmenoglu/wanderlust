import { Link } from "@remix-run/react";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import UserImage from "~/components/blocks/user-image";
import FormattedRating from "~/components/kit/formatted-rating";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GetReviewByIdResponseDto } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import { Menu } from "./menu";

type Props = {
  review: GetReviewByIdResponseDto;
};

export function ReviewCard({ review }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <UserImage className="size-16" src={review.user.profileImage ?? ""} />
        <div>
          <CardTitle>{review.user.fullName}</CardTitle>
          <CardDescription>@{review.user.username}</CardDescription>
        </div>
        <div className="ml-auto">
          <Menu review={review} />
        </div>
      </CardHeader>
      <CardContent>
        <div>{review.content}</div>
        <div className="grid grid-cols-2 max-w-48 gap-4">
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
                src={ipx(m.url, "w_64")}
                alt=""
                className="aspect-square object-contain"
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
      </CardContent>
      <CardFooter>
        <FormattedRating rating={review.rating} votes={1} />
        <Link
          to={`/report?type=review&id=${review.id}`}
          className="text-xs text-muted-foreground flex items-center ml-auto hover:underline"
        >
          <FlagIcon className="size-3" />
          <span className="ml-2">Report</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
