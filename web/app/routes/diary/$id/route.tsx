import leafletIconCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { data, isRouteErrorResponse, useRouteError } from "react-router";
import invariant from "tiny-invariant";
import yarlCaptionsStyles from "yet-another-react-lightbox/plugins/captions.css?url";
import yarlStyles from "yet-another-react-lightbox/styles.css?url";
import AppMessage from "~/components/blocks/app-message";
import CollapsibleText from "~/components/blocks/collapsible-text";
import { Separator } from "~/components/ui/separator";
import { getDiaryEntryById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import Friends from "./components/friends";
import Header from "./components/header";
import Locations from "./components/locations";
import Media from "./components/media";

export async function loader({ params, request }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  try {
    const res = await getDiaryEntryById(params.id, {
      headers: { Cookie: getCookiesFromRequest(request) },
    });
    return { entry: res.data };
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw data("You do not have permissions to view this diary entry", {
        status: 403,
      });
    } else if (status === 404) {
      throw data("Diary entry not found", { status: 404 });
    } else {
      throw data("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta({ data, error }: Route.MetaArgs): Route.MetaDescriptors {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `${data.entry.title} | Wanderlust` }];
  }

  return [{ title: "Diary | Wanderlust" }];
}

export function links(): Route.LinkDescriptors {
  return [
    { rel: "stylesheet", href: leafletStyles },
    { rel: "stylesheet", href: leafletIconCompatStyles },
    { rel: "stylesheet", href: yarlStyles },
    { rel: "stylesheet", href: yarlCaptionsStyles },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { entry } = loaderData;

  return (
    <div className="max-w-7xl mx-auto my-8">
      <Header />

      <Separator className="my-2" />

      <div className="mx-auto">
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
