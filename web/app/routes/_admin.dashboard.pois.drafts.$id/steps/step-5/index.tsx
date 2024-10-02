import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Dnd from "~/components/blocks/file-upload-dnd";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { loader } from "../../route";
import { useUpload } from "./hooks";

export default function Step5() {
  const { draft } = useLoaderData<typeof loader>();
  const [fileError, setFileError] = useState<string[]>([]);
  const [collapseApi, fileApi] = useUpload();

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Upload Media</h3>

      <div className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
        <div className="col-span-2">
          
        </div>
        <div>
          <Link
            to={`/dashboard/pois/drafts/${draft.id}?step=4`}
            className={cn(
              "block w-full",
              buttonVariants({ variant: "default" })
            )}
          >
            Previous
          </Link>
        </div>

        <div>
          <Button type="button" className="block w-full">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
