import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createList } from "~/lib/api-requests";

export default function CreateListDialog() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isErr = name.length > 128 || name.length < 1;
  const showErr = isDirty && isErr;
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["list-create"],
    mutationFn: async () => createList({ name, isPublic }),
    onSuccess: (res) => {
      toast.success("List created");
      navigate(`/lists/${res.data.id}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="space-x-2">
          <PlusIcon className="size-4" />
          <span>New List</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="off"
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
            />
            {showErr && (
              <div className="text-sm text-destructive">
                Name length should be between 1 and 128 characters
              </div>
            )}
          </div>

          <div className="w-full">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(c) => {
                setIsPublic(c === true);
              }}
            />
            <Label htmlFor="is-public" className="ml-2">
              Public list
            </Label>
            <InputInfo text="If you make your list public, other users can see it." />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="default"
            disabled={isErr}
            onClick={() => mutation.mutate()}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
