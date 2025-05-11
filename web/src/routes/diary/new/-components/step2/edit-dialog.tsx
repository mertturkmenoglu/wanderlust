import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { lengthTracker } from '@/lib/form';
import { PencilIcon } from 'lucide-react';
import { useSaveToLocalStorage, type FormType } from '../../-hooks';
import ActionButton from './action-button';

type Props = {
  form: FormType;
  name: string;
  index: number;
};

export default function EditDialog({ form, name, index }: Props) {
  const { saveToLocalStorage } = useSaveToLocalStorage(form);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionButton>
          <PencilIcon className="size-3" />
          <span className="sr-only">Edit {name} description</span>
        </ActionButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Description</DialogTitle>
          <DialogDescription>
            <div className="text-sm">
              You can add a short description for this location.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              placeholder="Add a short description"
              {...form.register(`locations.${index}.description`)}
            />
            <InputInfo
              text={lengthTracker(
                form.watch(`locations.${index}.description`),
                256,
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={async () => {
              await saveToLocalStorage();
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
