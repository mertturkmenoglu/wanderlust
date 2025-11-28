import { InputInfo } from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  onSuccess: (
    data: components['schemas']['CreateListOutputBody'],
  ) => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateListDialog({
  children,
  onSuccess,
  open,
  setOpen,
}: Props) {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isErr = name.length > 128 || name.length === 0;
  const showErr = isDirty && isErr;

  const mutation = api.useMutation('post', '/api/v2/lists/', {
    onSuccess,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              placeholder="My Favorite Places"
              autoComplete="off"
              className="w-full mt-1"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
            />
            {showErr && (
              <div className="text-xs text-destructive mt-1">
                Name length should be between 1 and 128 characters
              </div>
            )}
          </div>

          <div className="w-full flex">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(c) => {
                setIsPublic(c === true);
              }}
            />
            <div className="ml-2">
              <Label htmlFor="is-public">Public list</Label>
              <InputInfo text="If you make your list public, other users can see it." />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="default"
            disabled={isErr}
            onClick={() =>
              mutation.mutate({
                body: {
                  isPublic,
                  name,
                },
              })
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
