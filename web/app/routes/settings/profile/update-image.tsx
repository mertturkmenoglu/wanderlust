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
import { updateBannerImage, updateUserProfileImage } from "~/lib/api";
import { cn } from "~/lib/utils";

type Props = {
  image: string | null;
  fallbackImage: string;
  fullName: string;
  action: "profile" | "banner";
};

function useProfileMutation() {
  return useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData) => updateUserProfileImage(formData),
    onSuccess: () => {
      toast.success("Profile image updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}

function useBannerMutation() {
  return useMutation({
    mutationKey: ["update-banner-image"],
    mutationFn: async (formData: FormData) => updateBannerImage(formData),
    onSuccess: () => {
      toast.success("Banner image updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}

export default function UpdateImage({
  image,
  fallbackImage,
  fullName,
  action,
}: Props) {
  const [preview, setPreview] = useState(() =>
    image === null ? fallbackImage : image
  );
  const [file, setFile] = useState<File | null>(null);
  const profile = useProfileMutation();
  const banner = useBannerMutation();

  return (
    <div className="mt-4 max-w-xl flex gap-4 ml-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">Change {action} image</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Select a new {action === "profile" ? "profile" : "banner"} image
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-x-2 text-sm gap-8">
            <div className="flex flex-col items-center gap-4">
              <img
                src={preview}
                alt={fullName}
                className={cn("mt-4 rounded-md object-cover", {
                  "w-48 aspect-square": action === "profile",
                  "w-80 aspect-video": action === "banner",
                })}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`${action}-image`}
                className={cn(
                  "mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-primary/10",
                  "text-primary hover:bg-primary/20 cursor-pointer",
                  "transition-colors flex items-center gap-4 justify-center"
                )}
              >
                <UploadIcon className="size-4 text-primary" />
                {!file ? `Upload a ${action} image` : "Change selection"}
              </label>
              <div className="text-xs text-muted-foreground mt-2">
                PNG, JPEG, GIF, and WebP are supported. Maximum 5MB.
              </div>
              <input
                id={`${action}-image`}
                type="file"
                name="files"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                placeholder={`Upload a ${action} image`}
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

                if (action === "profile") {
                  profile.mutate(form);
                } else {
                  banner.mutate(form);
                }
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
