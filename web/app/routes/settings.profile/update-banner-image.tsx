import { useMutation } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { updateBannerImage } from "~/lib/api-requests";
import { cn } from "~/lib/utils";

type Props = {
  image: string | null;
  fullName: string;
};

export default function UpdateBannerImage({ image, fullName }: Props) {
  const [preview, setPreview] = useState(() =>
    image === null ? "https://i.imgur.com/EwvUEmR.jpg" : image
  );
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationKey: ["update-banner-image"],
    mutationFn: async (formData: FormData) => updateBannerImage(formData),
    onSuccess: () => {
      toast.success("Banner image updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="mt-4 max-w-xl flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative group">
            <img
              src={preview}
              alt={fullName}
              className="mt-4 w-64 rounded-md aspect-video object-cover"
            />
            <div
              className={cn(
                "flex items-center justify-center absolute p-2 top-1/2 left-1/2 -translate-x-1/2",
                "bg-primary/80 rounded-full gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out"
              )}
            >
              <UploadIcon className="size-4 text-white" />
              <span className="text-xs text-white">Update</span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Select a new banner image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-x-2 text-sm gap-8">
            <div className="flex flex-col items-center gap-4">
              <img
                src={preview}
                alt={fullName}
                className="mt-4 w-80 rounded-md aspect-video object-cover"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="banner-image"
                className={cn(
                  "mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-primary/10",
                  "text-primary hover:bg-primary/20 cursor-pointer",
                  "transition-colors flex items-center gap-4 justify-center"
                )}
              >
                <UploadIcon className="size-4 text-primary" />
                {!file ? "Upload a banner image" : "Change selection"}
              </label>
              <div className="text-xs text-muted-foreground mt-2">
                PNG, JPEG, GIF, and WebP are supported. Maximum 5MB.
              </div>
              <input
                id="banner-image"
                type="file"
                name="files"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                placeholder="Upload a banner image"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    setFile(file);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                if (!file) {
                  return;
                }

                const form = new FormData();

                form.append("files", file);
                mutation.mutate(form);
              }}
              disabled={!file}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
