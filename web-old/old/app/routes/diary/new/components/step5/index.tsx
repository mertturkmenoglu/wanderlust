import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import Uppy, { Meta } from "@uppy/core";
import { useUppyState } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { createDiaryEntry } from "~/lib/api-requests";
import { CreateDiaryEntryRequestDto } from "~/lib/dto";
import { FormInput } from "../../schema";

type Props = {
  baseApiUrl: string;
  uppy: Uppy<Meta, Record<string, never>>;
};

function strOrDefault(s: string, defaultValue: string): string {
  return s === "" ? defaultValue : s;
}

export default function Step5({ baseApiUrl, uppy }: Props) {
  const form = useFormContext<FormInput>();
  const files = useUppyState(uppy, (s) => s.files);
  const fileCount = Object.keys(files).length;
  const [share, setShare] = useState(form.getValues("shareWithFriends"));

  const description = form.watch("description");
  const title = form.watch("title");
  const date = form.watch("date");
  const locations = form.watch("locations");
  const friends = form.watch("friends");

  const shortDescription =
    description.length > 256 ? description.slice(0, 256) + "..." : description;

  const canCreateEntry = form.formState.isValid;

  const navigate = useNavigate();

  const entryMutation = useMutation({
    mutationKey: ["create-diary-entry"],
    mutationFn: async () => {
      form.reset(form.getValues());
      const values = form.getValues();
      const dto: CreateDiaryEntryRequestDto = {
        date: values.date.toISOString(),
        description: values.description,
        shareWithFriends: values.shareWithFriends,
        title: values.title,
        friends: values.friends.map((f) => f.id),
        locations: values.locations.map((l) => ({
          id: l.id,
          description: l.description === "" ? null : l.description,
        })),
      };
      return createDiaryEntry(dto);
    },
    onSuccess: (res) => {
      uploadMutation.mutate({ entryId: res.data.id });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const uploadMutation = useMutation({
    mutationKey: ["upload-diary-entry-media"],
    mutationFn: async ({ entryId }: { entryId: string }) => {
      const uppyWithXHR = uppy
        .use(XHRUpload, {
          endpoint: `${baseApiUrl}diary/media/${entryId}`,
          withCredentials: true,
          shouldRetry: () => false,
          fieldName: "files",
          limit: 1,
        })
        .on("complete", (res) => {
          if (res.failed?.length === 0) {
            toast.success("Created. Redirecting.");
            localStorage.removeItem("diary-entry");
            navigate("/diary");
          }
        })
        .on("error", () => {
          toast.error("Media upload failed");
        });
      await uppyWithXHR.upload();
    },
  });

  return (
    <div className="flex flex-col mx-auto max-w-xl mt-4">
      <div>
        <h3 className="text-muted-foreground text-lg">Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
          <div>Title:</div>
          <div>{strOrDefault(title, "No title")}</div>
          <div>Description:</div>
          <div>{strOrDefault(shortDescription, "No description")}</div>
          <div>Date:</div>
          <div>{date.toLocaleDateString()}</div>
          <div>Locations:</div>
          <ul>
            {locations.map((l) => (
              <li key={l.id} className="list-disc list-outside">
                {l.name}
              </li>
            ))}
            {locations.length === 0 && <div>No locations</div>}
          </ul>
          <div>Friends:</div>
          <ul>
            {friends.map((f) => (
              <li key={f.id} className="list-disc list-outside">
                {f.fullName}
              </li>
            ))}
            {friends.length === 0 && <div>No friends</div>}
          </ul>
          <div>Media:</div>
          <div>
            {fileCount > 0 ? "Selected " + fileCount + " files" : "No files"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          checked={share}
          onCheckedChange={() => {
            setShare((prev) => {
              form.setValue("shareWithFriends", !prev);
              return !prev;
            });
          }}
        />
        <Label htmlFor="share-with-friends">Share with friends</Label>
      </div>

      <Button
        className="mt-4"
        disabled={!canCreateEntry}
        onClick={() => {
          entryMutation.mutate();
        }}
      >
        Create Diary Entry
      </Button>
    </div>
  );
}
