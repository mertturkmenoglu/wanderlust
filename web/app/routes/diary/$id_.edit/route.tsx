import { data } from "react-router";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getDiaryEntryById, getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import DeleteDialog from "./components/delete-dialog";
import TabInfo from "./components/tab-info";
import TabLocations from "./components/tab-locations";

export async function loader({ params, request }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  try {
    const res = await getDiaryEntryById(params.id, {
      headers: { Cookie: getCookiesFromRequest(request) },
    });
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (auth.data.id !== res.data.userId) {
      throw data("You do not have permissions to edit this diary entry", {
        status: 403,
      });
    }

    return { entry: res.data };
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw data("You do not have permissions to edit this diary entry", {
        status: 403,
      });
    } else if (status === 404) {
      throw data("Diary entry not found", { status: 404 });
    } else {
      throw data("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Edit Diary Entry | Wanderlust" }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { entry } = loaderData;

  return (
    <div className="mx-auto max-w-7xl my-8">
      <div className="flex items-center justify-between">
        <div>
          <BackLink href={`/diary/${entry.id}`} text="Go back to the diary" />
          <h2 className="text-2xl tracking-tighter">{entry.title}</h2>
        </div>

        <div>
          <DeleteDialog id={entry.id} />
        </div>
      </div>
      <Separator className="my-2" />

      <Tabs
        defaultValue="info"
        className="flex flex-col max-w-4xl items-center mx-auto"
      >
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="w-full">
          <TabInfo />
        </TabsContent>
        <TabsContent value="locations" className="w-full">
          <TabLocations />
        </TabsContent>
        <TabsContent value="friends">Friends</TabsContent>
        <TabsContent value="media">Media</TabsContent>
      </Tabs>
    </div>
  );
}
