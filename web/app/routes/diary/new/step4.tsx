import { Uppy } from "@uppy/core";
import ImageEditor from "@uppy/image-editor/lib/ImageEditor";
import XHRUpload from "@uppy/xhr-upload";
import { useState } from "react";
import { FormType } from "./hooks";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/file-input/dist/style.css";
import "@uppy/image-editor/dist/style.min.css";
import { DashboardModal } from "@uppy/react";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "~/components/ui/button";

type Props = {
  form: FormType;
  baseApiUrl: string;
};

export default function Step4({ form, baseApiUrl }: Props) {
  const [uppy] = useState(() =>
    new Uppy()
      .use(ImageEditor)
      .use(XHRUpload, {
        endpoint: `${baseApiUrl}diary/media`,
        withCredentials: true,
        shouldRetry: () => false,
        fieldName: "files",
        limit: 5,
      })
      .on("file-added", (file) => {
        console.log("file added", file);
      })
      .on("complete", () => {
        console.log("complete");
      })
  );

  return (
    <div className="w-full mt-16 max-w-2xl mx-auto">
      <div className="text-lg text-muted-foreground text-center">
        Now let's add a couple of pictures
      </div>

      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <>
            <div className="mx-auto text-center mt-8">
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
    </div>
  );
}
