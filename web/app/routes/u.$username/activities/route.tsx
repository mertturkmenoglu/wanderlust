import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { getUserActivities } from "~/lib/api-requests";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.username, "username is required");
  return json({ username: params.username });
}

export default function ActivitiesPage() {
  const { username } = useLoaderData<typeof loader>();

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
