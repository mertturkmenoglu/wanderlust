import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import { Dashboard } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import { PencilIcon, UploadIcon } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
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
import { createReview } from "~/lib/api-requests";
import { lengthTracker } from "~/lib/form-utils";
import { loader } from "../../route";
import { AuthContext } from "~/providers/auth-provider";

const schema = z.object({
  content: z.string().min(5).max(2048),
});

type FormInput = z.infer<typeof schema>;

export default function CreateReviewDialog() {
  const { poi, baseApiUrl } = useLoaderData<typeof loader>();
  const [rating, setRating] = useState(0);
  const qc = useQueryClient();
  const revalidator = useRevalidator();
  const auth = useContext(AuthContext);
  const isAuthenticated = !auth.isLoading && auth.user;

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const [uppy] = useState(() => {
    const uppy = new Uppy({
      restrictions: {
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
        maxNumberOfFiles: 10,
        maxFileSize: 5 * 1024 * 1024,
      },
    }).use(ImageEditor);

    return uppy;
  });

  const create = useMutation({
    mutationKey: ["create-review"],
    mutationFn: async () =>
      createReview({
        content: form.getValues("content"),
        poiId: poi.id,
        rating: rating,
      }),
    onSuccess: ({ data }) => {
      mediaUpload.mutate(data.id);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const mediaUpload = useMutation({
    mutationKey: ["review-media-upload"],
    mutationFn: async (reviewId: string) => {
      const uppyWithXHR = uppy
        .use(XHRUpload, {
          endpoint: `${baseApiUrl}reviews/${reviewId}/media`,
          withCredentials: true,
          shouldRetry: () => false,
          fieldName: "files",
          limit: 5,
        })
        .on("complete", async (res) => {
          if (res.failed?.length === 0) {
            await qc.invalidateQueries({ queryKey: ["reviews", poi.id] });
            await qc.invalidateQueries({ queryKey: ["poi-ratings", poi.id] });
            revalidator.revalidate();
            uppy.clear();
            form.reset({ content: "" });
            setRating(0);
            toast.success("Review added.");
          }
        })
        .on("error", () => {
          toast.error("Media upload failed");
        });

      await uppyWithXHR.upload();
    },
  });

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link to="/sign-in">
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
        </Link>
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm">
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
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
            <InputInfo text={lengthTracker(form.watch("content"), 2048)} />
            <InputError error={form.formState.errors.content} />
          </div>

          <Collapsible className="mx-auto sm:max-w-4xl">
            <CollapsibleTrigger className="w-full">
              <Button variant="ghost">
                <UploadIcon className="size-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="max-w-md sm:max-w-xl md:max-w-3xl mt-2">
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
          <AlertDialogAction onClick={() => create.mutate()}>
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
