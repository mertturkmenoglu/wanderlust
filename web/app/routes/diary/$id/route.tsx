import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import leafletIconCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { Grid2X2Icon, MapIcon, PencilIcon } from "lucide-react";
import { useContext, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import yarlCaptionsStyles from "yet-another-react-lightbox/plugins/captions.css?url";
import yarlStyles from "yet-another-react-lightbox/styles.css?url";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import CollapsibleText from "~/components/blocks/collapsible-text";
import PoiCard from "~/components/blocks/poi-card";
import UserCard from "~/components/blocks/user-card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getDiaryEntryById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";
import { Map } from "./components/map.client";
import SharePopover from "./components/share-popover";

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

type LocationDisplayMode = "grid" | "map";

export default function Page() {
  const { entry } = useLoaderData<typeof loader>();
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.data?.id === entry.userId;
  const [locationsDisplay, setLocationsDisplay] =
    useState<LocationDisplayMode>("grid");
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/diary" text="Go back to the diary" />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">{entry.title}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <div>Created by: {isOwner ? "You" : entry.user.fullName}</div>
            <div className="ml-1">
              at{" "}
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </div>
          </div>
        </div>

        <div className="space-x-2">
          {isOwner && (
            <>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}>
                    <SharePopover
                      id={entry.id}
                      friendsCount={entry.friends.length}
                      share={entry.shareWithFriends}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Share
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger tabIndex={-1}>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/diary/${entry.id}/edit`}>
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit diary entry</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Edit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>

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

        <div className="flex justify-between items-center">
          <div className="text-xl font-medium">Locations</div>
          <div>
            <ToggleGroup
              type="single"
              value={locationsDisplay}
              onValueChange={(v) => {
                if (v) {
                  setLocationsDisplay(v === "grid" ? v : "map");
                }
              }}
            >
              <ToggleGroupItem value="grid" aria-label="Toggle bold">
                <Grid2X2Icon className="h-4 w-4" />
                <span className="ml-1">Grid</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Toggle italic">
                <MapIcon className="h-4 w-4" />
                <span className="ml-1">Map</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {locationsDisplay === "grid" ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.locations.map((location) => (
              <Link to={`/p/${location.poi.id}`}>
                <PoiCard
                  poi={{
                    ...location.poi,
                    image: location.poi.firstMedia,
                  }}
                />
                <div className="mt-4 text-muted-foreground">
                  {location.description}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>
            <ClientOnly
              fallback={<div className="w-full h-[400px] bg-muted mt-4" />}
            >
              {() => <Map locations={entry.locations} />}
            </ClientOnly>
          </div>
        )}

        <Separator className="my-8" />

        <div className="text-xl font-medium">Friends</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {entry.friends.length === 0 && (
            <div className="col-span-full">
              <AppMessage
                emptyMessage="You haven't added any friends."
                showBackButton={false}
                className="my-8"
              />
            </div>
          )}
          {entry.friends.map((f) => (
            <Link to={`/u/${f.username}`}>
              <UserCard
                fullName={f.fullName}
                image={f.profileImage}
                username={f.username}
              />
            </Link>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="text-xl font-medium">Media</div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {entry.media.map((m, i) => (
            <button
              key={m.url}
              className={cn("", {
                "col-span-4": entry.media.length === 1,
                "col-span-4 mx-auto": entry.media.length === 3 && i === 2,
              })}
              onClick={() => {
                setImageIndex(() => {
                  setOpen(true);
                  return i;
                });
              }}
            >
              <img
                src={m.url}
                alt={m.alt}
                className={cn("aspect-square object-contain")}
              />
            </button>
          ))}
        </div>

        <Lightbox
          open={open}
          plugins={[Captions]}
          close={() => setOpen(false)}
          slides={entry.media.map((m) => ({
            src: m.url,
            description: m.caption ?? "",
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
          index={imageIndex}
        />
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
