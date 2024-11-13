import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData } from "@remix-run/react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import { PlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputError from "~/components/kit/input-error";
import { Rating } from "~/components/kit/rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { loader } from "../route";

const schema = z.object({
  content: z.string().min(5).max(2048),
});

type FormInput = z.infer<typeof schema>;

export default function CreateReviewDialog() {
  const { poi } = useLoaderData<typeof loader>();
  const [rating, setRating] = useState(0);
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
        maxNumberOfFiles: 10,
        maxFileSize: 5 * 1024 * 1024,
      },
    })
      .use(ImageEditor)
      .use(XHRUpload, {
        endpoint: `pois/media`,
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">
          <span>Add a review</span>
          <PlusIcon className="size-4 ml-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Add a review</AlertDialogTitle>
          <AlertDialogDescription>
            Add a review to {poi.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="sr-only">Rating</span>
            <Rating
              id="rating"
              defaultValue={0}
              onChange={(v) => setRating(v.value)}
              disabled={false}
              starsClassName="size-8"
            />
          </div>

          <div>
            <Label htmlFor="content">Review</Label>
            <Textarea
              id="content"
              rows={5}
              placeholder="Leave a review"
              {...form.register("content")}
            />
            <InputError error={form.formState.errors.content} />
          </div>

          <Collapsible className="mx-auto sm:max-w-4xl">
            <CollapsibleTrigger className="w-full">
              <Button variant="ghost">
                <UploadIcon className="size-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="max-w-md sm:max-w-xl md:max-w-3xl">
                <Dashboard
                  uppy={uppy}
                  hideUploadButton={true}
                  hideCancelButton={true}
                  height={384}
                  note={"Maximum 4 images. Limit 5 MB."}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              alert(
                JSON.stringify({
                  content: form.getValues("content"),
                  rating,
                })
              )
            }
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
