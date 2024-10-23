import Uppy, { Meta } from "@uppy/core";
import { useUppyState } from "@uppy/react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FormType } from "../../hooks";

type Props = {
  form: FormType;
  uppy: Uppy<Meta, Record<string, never>>;
};

export default function Step5({ form, uppy }: Props) {
  const files = useUppyState(uppy, (s) => s.files);
  const fileCount = Object.keys(files).length;
  const description = form.watch("description");
  const shortDescription =
    description.length > 256 ? description.slice(0, 256) + "..." : description;

  return (
    <div className="flex flex-col mx-auto max-w-xl">
      <div>
        <h3 className="text-muted-foreground text-lg">Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
          <div>Title:</div>
          <div>{form.watch("title")}</div>
          <div>Description:</div>
          <div>{shortDescription}</div>
          <div>Date:</div>
          <div>{form.watch("date").toLocaleDateString()}</div>
          <div>Locations:</div>
          <ul>
            {form.watch("locations").map((l) => (
              <li key={l.id} className="list-disc list-outside">
                {l.name}
              </li>
            ))}
          </ul>
          <div>Friends:</div>
          <ul>
            {form.watch("friends").map((f) => (
              <li key={f.id} className="list-disc list-outside">
                {f.fullName}
              </li>
            ))}
          </ul>
          <div>Media:</div>
          <div>
            {fileCount > 0 ? "Selected " + fileCount + " files" : "No files"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox {...form.register("shareWithFriends")} />
        <Label htmlFor="share-with-friends">Share with friends</Label>
      </div>

      <Button className="mt-4">Create Diary Entry</Button>
    </div>
  );
}
