import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import AppMessage from "~/components/blocks/app-message";
import { cn } from "~/lib/utils";
import { loader } from "../route";

export default function Media() {
  const { entry } = useLoaderData<typeof loader>();

  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <>
      <div className="text-xl font-medium">Media</div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {entry.media.length === 0 && (
          <AppMessage
            emptyMessage="No images"
            showBackButton={false}
            className="col-span-full"
          />
        )}
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
    </>
  );
}
