"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Link, useRevalidator } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "~/components/kit/spinner";
import { Button } from "~/components/ui/button";
import { follow } from "~/lib/api-requests";

type Props = {
  loading: boolean;
  isThisUser: boolean;
  isFollowing: boolean;
  username: string;
};

export default function ActionButtons({
  loading,
  isThisUser,
  isFollowing,
  username,
}: Props) {
  const revalidator = useRevalidator();

  const mutation = useMutation({
    mutationKey: ["follow", username],
    mutationFn: async () => follow(username),
    onSettled: async () => {
      toast.success(isFollowing ? "Unfollowed" : "Followed");
      revalidator.revalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function handleFollowClick() {
    mutation.mutate();
  }

  if (loading) {
    return (
      <Button variant="outline">
        <Spinner />
      </Button>
    );
  }

  return (
    <>
      {isThisUser ? (
        <Button asChild variant="outline">
          <Link to="/settings">Settings</Link>
        </Button>
      ) : (
        <Button
          variant={isFollowing ? "outline" : "default"}
          onClick={handleFollowClick}
          disabled={mutation.isPending}
        >
          {isFollowing ? "Following" : "Follow"}
          {mutation.isPending && (
            <ReloadIcon className="ml-2 size-4 animate-spin" />
          )}
        </Button>
      )}
    </>
  );
}
