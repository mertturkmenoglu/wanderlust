import Uppy, { Meta } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { ClientOnly } from "remix-utils/client-only";

type Props = {
  uppy: Uppy<Meta, Record<string, never>>;
};

export default function Step4({ uppy }: Props) {
  return (
    <div className="w-full mt-16 max-w-2xl mx-auto">
      <div className="text-lg text-muted-foreground text-center">
        Now let's add a couple of pictures
      </div>

      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <>
            <Dashboard
              uppy={uppy}
              className="col-span-2 mx-auto mt-4"
              hideUploadButton={true}
              hideCancelButton={true}
              note={"Images only, 1-10 files, up to 5 MB"}
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
