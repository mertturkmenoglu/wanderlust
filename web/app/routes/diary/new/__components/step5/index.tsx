import Uppy, { Meta } from "@uppy/core";
import { useUppyState } from "@uppy/react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FormInput } from "../../schema";

type Props = {
  uppy: Uppy<Meta, Record<string, never>>;
};

function strOrDefault(s: string, defaultValue: string): string {
  return s === "" ? defaultValue : s;
}

export default function Step5({ uppy }: Props) {
  const form = useFormContext<FormInput>();
  const files = useUppyState(uppy, (s) => s.files);
  const fileCount = Object.keys(files).length;

  const description = form.watch("description");
  const title = form.watch("title");
  const date = form.watch("date");
  const locations = form.watch("locations");
  const friends = form.watch("friends");

  const shortDescription =
    description.length > 256 ? description.slice(0, 256) + "..." : description;

  const canCreateEntry = form.formState.isValid;

  return (
    <div className="flex flex-col mx-auto max-w-xl mt-16">
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
        <Checkbox {...form.register("shareWithFriends")} />
        <Label htmlFor="share-with-friends">Share with friends</Label>
      </div>

      <Button className="mt-4" disabled={!canCreateEntry}>
        Create Diary Entry
      </Button>
    </div>
  );
}
