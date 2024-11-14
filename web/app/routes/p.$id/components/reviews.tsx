import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import {
  EllipsisVerticalIcon,
  FlagIcon,
  LoaderCircleIcon,
  TrashIcon,
} from "lucide-react";
import { useContext } from "react";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import FormattedRating from "~/components/kit/formatted-rating";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getReviewsByPoiId } from "~/lib/api-requests";
import { GetReviewByIdResponseDto } from "~/lib/dto";
import { AuthContext } from "~/providers/auth-provider";
import { loader } from "../route";
import CreateReviewDialog from "./create-review-dialog";

export default function Reviews() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Reviews</h3>
        <CreateReviewDialog />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <ReviewsSection />
      </div>
    </div>
  );
}

function ReviewsSection() {
  const { poi } = useLoaderData<typeof loader>();

  const query = useQuery({
    queryKey: ["reviews", poi.id],
    queryFn: async () => getReviewsByPoiId(poi.id, 1, 25),
  });

  if (query.isLoading) {
    return (
      <LoaderCircleIcon className="animate-spin size-12 text-primary mx-auto my-16 col-span-full" />
    );
  }

  if (query.isError) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        showBackButton={false}
        className="mx-auto col-span-full my-16"
      />
    );
  }

  if (query.data && query.data.data.reviews.length === 0) {
    return (
      <AppMessage
        emptyMessage="There are no reviews yet."
        showBackButton={false}
        className="mx-auto col-span-full my-16"
      />
    );
  }

  if (!query.data) {
    return <></>;
  }

  return (
    <>
      {query.data.data.reviews.map((review) => (
        <ReviewCard review={review} key={review.id} />
      ))}
    </>
  );
}

type Props = {
  review: GetReviewByIdResponseDto;
};

function ReviewCard({ review }: Props) {
  const auth = useContext(AuthContext);
  const doesBelongToCurrentUser = auth.user?.data.id === review.userId;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <UserImage className="size-16" src={review.user.profileImage ?? ""} />
        <div>
          <CardTitle>{review.user.fullName}</CardTitle>
          <CardDescription>@{review.user.username}</CardDescription>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>
                Report
                <DropdownMenuShortcut>
                  <FlagIcon className="size-3" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              {doesBelongToCurrentUser && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    Delete
                    <DropdownMenuShortcut>
                      <TrashIcon className="size-3" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>{review.content}</CardContent>
      <CardFooter>
        <FormattedRating rating={review.rating} votes={1} />
        <div className="text-xs text-muted-foreground flex items-center ml-auto">
          <FlagIcon className="size-3" />
          <span className="ml-2">Report</span>
        </div>
      </CardFooter>
    </Card>
  );
}
