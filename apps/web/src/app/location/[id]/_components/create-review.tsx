'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Rating } from '@/components/ui/rating';
import { Textarea } from '@/components/ui/textarea';
import * as collapsible from '@zag-js/collapsible';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { Upload, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

type Props = {
  name: string;
  locationId: string;
};

const getPreview = (f: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        res(event.target.result as string);
      }
    };
    reader.onerror = (err) => {
      rej(err);
    };
    reader.readAsDataURL(f);
  });
};

export default function CreateReview({ name, locationId }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string[]>([]);
  const [cstate, csend] = useMachine(collapsible.machine({ id: useId() }));
  const capi = collapsible.connect(cstate, csend, normalizeProps);
  const [fstate, fsend] = useMachine(
    fileUpload.machine({
      id: useId(),
      accept: 'image/*',
      maxFiles: 4,
      maxFileSize: 1024 * 1024 * 2, // 2MB
    })
  );
  const fapi = fileUpload.connect(fstate, fsend, normalizeProps);

  function createReview() {
    setError([]);
    if (!comment) {
      setError((prev) => [...prev, 'Please enter a comment']);
    }
    if (rating === 0) {
      setError((prev) => [...prev, 'Please select a rating']);
    }

    if (!comment || rating === 0) {
      return;
    }

    console.log('Creating review', { rating, comment, locationId });
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Your Review</DialogTitle>
        <DialogDescription>Share your experience with others</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-bold capitalize">{name}</p>
          <Rating
            id="review"
            onChange={(v) => setRating(v.value)}
          />
        </div>
        <div className="">
          <Textarea
            id="comment"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex flex-col items-center">
          <div
            {...capi.rootProps}
            className="flex w-full flex-col items-center text-center"
          >
            <Button
              {...capi.triggerProps}
              variant="ghost"
              size="icon"
            >
              <Upload className="size-4" />
            </Button>
            <div
              {...capi.contentProps}
              className="w-full"
            >
              <div
                {...fapi.rootProps}
                className="w-full rounded border border-dashed border-muted-foreground p-4"
              >
                <div {...fapi.dropzoneProps}>
                  <input {...fapi.hiddenInputProps} />
                  <span>Drag your file(s) here</span>
                  <span className="text-muted-foreground"> or</span>
                </div>

                <Button
                  {...fapi.triggerProps}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Choose file(s)
                </Button>

                <ul
                  {...fapi.itemGroupProps}
                  className="grid grid-cols-2"
                >
                  {fapi.acceptedFiles.map((file, i) => (
                    <li
                      key={file.name}
                      {...fapi.getItemProps({ file })}
                      className="mt-2 flex w-full items-center gap-4"
                    >
                      <Preview file={file} />

                      <Button
                        {...fapi.getItemDeleteTriggerProps({
                          file,
                        })}
                        variant="ghost"
                        size="icon"
                      >
                        <X className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-center">
          {error.length > 0 && (
            <ul className="space-y-1 text-sm text-red-500">
              {error.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter className="flex !justify-center">
        <Button
          type="button"
          className="block"
          onClick={createReview}
        >
          Create review
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

type PreviewProps = {
  file: File;
};

function Preview({ file }: PreviewProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getPreview(file).then((s) => {
      setSrc(s);
    });
  }, [file]);

  if (!src) {
    return <></>;
  }

  return (
    <img
      src={src}
      alt={file.name}
      className="h-12 w-12 rounded object-cover"
    />
  );
}
