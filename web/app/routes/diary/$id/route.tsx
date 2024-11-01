import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import leafletIconCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import invariant from "tiny-invariant";
import yarlCaptionsStyles from "yet-another-react-lightbox/plugins/captions.css?url";
import yarlStyles from "yet-another-react-lightbox/styles.css?url";
import AppMessage from "~/components/blocks/app-message";
import CollapsibleText from "~/components/blocks/collapsible-text";
import { Separator } from "~/components/ui/separator";
import { getDiaryEntryById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import Friends from "./components/friends";
import Header from "./components/header";
import Locations from "./components/locations";
import Media from "./components/media";

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

export function links() {
  return [
    { rel: "stylesheet", href: leafletStyles },
    { rel: "stylesheet", href: leafletIconCompatStyles },
    { rel: "stylesheet", href: yarlStyles },
    { rel: "stylesheet", href: yarlCaptionsStyles },
  ];
}

export default function Page() {
  const { entry } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto my-8">
      <Header />

      <Separator className="my-2" />

      <div className="max-w-4xl mx-auto">
        <div className="text-lg my-8 ml-auto text-end">
          {new Date(entry.date).toLocaleDateString("en-US", {
            dateStyle: "full",
          })}
        </div>

        <CollapsibleText
          text={entry.description}
          charLimit={1000}
          className="mt-4 text-justify"
        />

        <Separator className="my-8" />

        <Locations />

        <Separator className="my-8" />

        <Friends />

        <Separator className="my-8" />

        <Media />
      </div>
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
