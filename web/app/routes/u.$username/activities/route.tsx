import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { getUserActivities } from "~/lib/api-requests";
import { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.username, "username is required");
  return { username: params.username };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { username } = loaderData;

  const query = useQuery({
    queryKey: ["user-activities", username],
    queryFn: async () => getUserActivities(username),
  });

  if (query.error) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        className="my-16"
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    return (
      <div>
        <pre>{JSON.stringify(query.data.data, null, 2)}</pre>
      </div>
    );
  }

  return (
    <LoaderIcon className="my-16 mx-auto size-8 text-primary animate-spin" />
  );
}
