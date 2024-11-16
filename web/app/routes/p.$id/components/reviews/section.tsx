import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import { Separator } from "~/components/ui/separator";
import { getReviewsByPoiId } from "~/lib/api";
import { loader } from "../../route";
import { ReviewCard } from "./card";

export function Section() {
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
        <>
          <ReviewCard review={review} key={review.id} />
          <Separator className="my-2" />
        </>
      ))}
    </>
  );
}
