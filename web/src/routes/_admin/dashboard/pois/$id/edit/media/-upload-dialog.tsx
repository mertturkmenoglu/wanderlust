import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
import { fetchClient } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { TrashIcon, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpload } from './-hooks';

type Props = {
  poi: components['schemas']['Poi'];
};

export default function UploadDialog({ poi }: Props) {
  const fileApi = useUpload();
  const [alt, setAlt] = useState('');
  let f = fileApi.acceptedFiles[0];
  const preview = f ? URL.createObjectURL(f) : '';

  const upload = async () => {
    if (!f) {
      toast.error('No file selected');
      return;
    }

    let ext = f.name.split('.').at(-1);

    if (!ext) {
      toast.error('Invalid file');
      return;
    }

    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      toast.error('Invalid file type');
      return;
    }

    if (alt === '') {
      toast.error('Alt text is required');
      return;
    }

    let res = await fetchClient.GET('/api/v2/images/upload/', {
      params: {
        query: {
          bucket: 'pois',
          fileExt: ext,
        },
      },
    });

    if (res.error) {
      toast.error(res.error.title ?? 'Something went wrong');
      return;
    }

    let uploadRes = await fetch(res.data.url, {
      method: 'PUT',
      body: f,
    });

    if (!uploadRes.ok) {
      toast.error('Something went wrong');
      return;
    }

    let updateRes = await fetchClient.POST('/api/v2/pois/{id}/media', {
      params: {
        path: {
          id: poi.id,
        },
      },
      body: {
        id: res.data.id,
        alt: alt,
        fileName: res.data.fileName,
      },
    });

    if (updateRes.error) {
      toast.error(updateRes.error.title ?? 'Something went wrong');
      return;
    }

    toast.success('Media uploaded');
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="col-span-2 cursor-pointer"
      >
        <Button variant="default">
          <UploadIcon className="size-4" />
          <span>Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        {!f ? (
          <div
            className="text-sm text-muted-foreground text-center cursor-pointer flex flex-col gap-2"
            {...fileApi.getRootProps()}
          >
            <div
              {...fileApi.getDropzoneProps()}
              className="border border-dashed border-border rounded-md p-8 py-32"
            >
              <input {...fileApi.getHiddenInputProps()} />
              <span>Drag your file here</span>
              <div className="text-xs my-2">(or)</div>
              <button
                {...fileApi.getTriggerProps()}
                className="cursor-pointer"
              >
                Choose file
              </button>
            </div>
          </div>
        ) : (
          <div
            {...fileApi.getItemGroupProps()}
            className=""
          >
            <div
              key={f.name}
              {...fileApi.getItemProps({ file: f })}
              className="flex flex-col gap-2 items-center"
            >
              <img
                src={preview ?? null}
                alt=""
                className="w-full rounded-md object-cover"
              />
              <div
                {...fileApi.getItemNameProps({ file: f })}
                className="text-sm text-muted-foreground"
              >
                {f.name}
              </div>
              <Button
                variant="destructive"
                size="default"
                className="cursor-pointer w-full"
                {...fileApi.getItemDeleteTriggerProps({ file: f })}
              >
                <TrashIcon className="size-3" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        )}

        {f && (
          <div>
            <Separator className="" />
            <div className="flex gap-4 items-center mt-4">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  type="text"
                  id="alt"
                  placeholder="Describe the image for accessibility tools"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={upload}
            disabled={!f}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
