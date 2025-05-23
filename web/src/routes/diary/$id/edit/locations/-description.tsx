import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FormInput } from './-schema';

type Props = {
  index: number;
};

export default function Description({ index }: Props) {
  const form = useFormContext<FormInput>();
  const array = useFieldArray({
    control: form.control,
    name: 'locations',
  });
  const location = array.fields[index]!;
  const [text, setText] = useState(location.description ?? '');
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return (
      <div className="m-4 mt-0 ">
        <Label>Description</Label>

        <div className="flex items-center gap-2 mt-1">
          <Input
            className="max-w-sm"
            value={text}
            placeholder="Description"
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsEditMode(false);
              setText(location.description ?? '');
            }}
          >
            <XIcon className="size-3" />
            <span className="sr-only">Cancel</span>
          </Button>
          <Button
            size="icon"
            disabled={!text}
            onClick={() => {
              array.update(index, {
                ...location,
                description: text,
              });
              setIsEditMode(false);
            }}
          >
            <CheckIcon className="size-3" />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setIsEditMode(true);
        setText(location.description ?? '');
      }}
      className="text-muted-foreground flex p-4 pt-0"
    >
      {text.length > 0 ? text : 'Click to add a description'}
    </button>
  );
}
