import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { TrashIcon, UploadIcon } from 'lucide-react';
import { usePreviews, type UseUpload } from './hooks';

type Props = {
  up: UseUpload;
};

export function ImageUploadArea({ up }: Props) {
  const files = up.acceptedFiles;
  const previews = usePreviews(up);

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="w-full">
        <Button variant="ghost">
          <UploadIcon className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full">
        <div className="mt-2">
          {files.length === 0 ? (
            <div
              className="text-sm text-muted-foreground text-center cursor-pointer flex flex-col gap-2 w-full"
              {...up.getRootProps()}
            >
              <div
                {...up.getDropzoneProps()}
                className="border border-dashed border-border rounded-md p-8 py-32"
              >
                <input {...up.getHiddenInputProps()} />
                <span>Drag your file here</span>
                <div className="text-xs my-2">(or)</div>
                <button
                  type="button"
                  {...up.getTriggerProps()}
                  className="cursor-pointer"
                >
                  Choose file
                </button>
                <div className="text-xs">PNG or JPEG files up to 5MB each.</div>
              </div>
            </div>
          ) : (
            <div
              {...up.getItemGroupProps()}
              className={cn('grid gap-4', {
                'grid-cols-1': files.length === 1,
                'grid-cols-2': files.length >= 2,
              })}
            >
              {files.map((f, i) => (
                <div
                  key={f.name}
                  {...up.getItemProps({ file: f })}
                  className="flex flex-col gap-2 items-center"
                >
                  <img
                    src={previews[i] ?? ''}
                    alt=""
                    className="w-24 rounded-md object-cover"
                  />
                  <div
                    {...up.getItemNameProps({ file: f })}
                    className="text-sm text-muted-foreground"
                  >
                    {f.name}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    {...up.getItemDeleteTriggerProps({ file: f })}
                  >
                    <TrashIcon className="size-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
