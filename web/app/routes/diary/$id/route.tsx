import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useContext } from "react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import { Separator } from "~/components/ui/separator";
import { getDiaryEntryById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import { AuthContext } from "~/providers/auth-provider";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const res = await getDiaryEntryById(params.id, { headers: { Cookie } });
    return json({ entry: res.data });
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw json("You do not have permissions to view this diary entry", {
        status: 403,
      });
    } else if (status === 404) {
      throw json("Diary entry not found", { status: 404 });
    } else {
      throw json("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta({ data, error }: MetaArgs<typeof loader>) {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `${data.entry.title} | Wanderlust` }];
  }

  return [{ title: "Diary | Wanderlust" }];
}

export default function Page() {
  const { entry } = useLoaderData<typeof loader>();
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.data?.id === entry.userId;

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/diary" text="Go back to the diary" />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">{entry.title}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <div>Created by: {isOwner ? "You" : entry.user.fullName}</div>
            <div>{new Date(entry.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1"></div>
        </div>
      </div>

      <Separator className="my-2" />

      <pre>{JSON.stringify(entry, null, 2)}</pre>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <AppMessage
        errorMessage={error.data}
        className="my-32"
        backLink="/diary"
        backLinkText="Go back to the diary page"
      />
    );
  }

  return (
    <AppMessage
      errorMessage={"Something went wrong"}
      className="my-32"
      backLink="/diary"
      backLinkText="Go back to the diary page"
    />
  );
}
