import { useLoaderData } from "react-router";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { DashboardModal } from "@uppy/react";
import XHR from "@uppy/xhr-upload";
import { loader } from "../../route";
import StepsNavigation from "../steps-navigation";



import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "~/components/ui/button";
import { deleteDraftMedia } from "~/lib/api-requests";
import { ipx } from "~/lib/img-proxy";

export default function Step5() {
  const { draft, baseApiUrl } = useLoaderData<typeof loader>();
  const [uppy] = useState(() =>
    new Uppy()
      .use(ImageEditor)
      .use(XHR, {
        endpoint: `${baseApiUrl}pois/media`,
        withCredentials: true,
        shouldRetry: () => false,
        fieldName: "files",
        limit: 5,
      })
      .on("file-added", (file) => {
        uppy.setFileMeta(file.id, {
          id: draft.id,
        });
      })
      .on("complete", () => {
        window.location.reload();
      })
  );

  const media = draft.media ?? [];

  return (
    <div>
      <div className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
        <ClientOnly fallback={<div>Loading...</div>}>
          {() => (
            <>
              <div className="col-span-2">
                <Button id="btn">Upload New Media</Button>
              </div>
              <DashboardModal
                uppy={uppy}
                className="col-span-2 mx-auto"
                trigger={"#btn"}
                metaFields={[
                  { id: "name", name: "Name", placeholder: "file name" },
                  {
                    id: "caption",
                    name: "Caption",
                    placeholder: "Describe what the image is about",
                  },
                  {
                    id: "alt",
                    name: "Alt text",
                    placeholder: "Describe the image for accessibility tools",
                  },
                  {
                    id: "order",
                    name: "Order",
                    placeholder: "Order of the image",
                  },
                ]}
              />
            </>
          )}
        </ClientOnly>

        <div className="col-span-2">
          <h3 className="text-2xl font-bold tracking-tight">Uploaded</h3>
        </div>

        <div className="col-span-2 space-y-8">
          {media.map(
            (m: {
              url: string;
              alt: string | null;
              caption: string | null;
              order: number;
            }) => (
              <div key={m.url} className="flex gap-4 items-center">
                <Button
                  variant="destructive"
                  type="button"
                  size="icon"
                  onClick={async () => {
                    const name = m.url.split("/").at(-1) ?? "";
                    try {
                      await deleteDraftMedia(draft.id, name);
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <TrashIcon className="size-4" />
                </Button>
                <img
                  src={ipx(m.url, "w_512")}
                  alt={m.alt ?? ""}
                  className="w-64 rounded-md aspect-video object-cover"
                />
                <div className="text-sm text-muted-foreground">
                  <div>URL: {m.url}</div>
                  <div>Caption: {m.caption}</div>
                  <div>Alt: {m.alt}</div>
                  <div>Order: {m.order}</div>
                </div>
              </div>
            )
          )}
        </div>

        <StepsNavigation draftId={draft.id} step={5} />
      </div>
    </div>
  );
}
