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
import { fetchClient } from '@/lib/api';
import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateDraftMutation } from '../use-update-draft';
import { useUpload } from './hooks';

type Props = {
  draft: any;
};

export default function UploadDialog({ draft }: Props) {
  const api = useUpload();
  const [preview, setPreview] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  let f = api.acceptedFiles[0];
  const mutation = useUpdateDraftMutation(draft, 3);

  useEffect(() => {
    if (!f) {
      setPreview('');
      return;
    }

    let preview = URL.createObjectURL(f);
    setPreview(preview);
  }, [f]);

  return (
    <Dialog>
      <DialogTrigger asChild className="col-span-2 cursor-pointer">
        <Button variant="secondary">Upload</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        {!f && (
          <div className="text-sm text-muted-foreground border border-dashed border-border rounded-md p-8 flex flex-col gap-4 items-center justify-center text-center">
            <div {...api.getRootProps()} className="cursor-pointer">
              <div {...api.getDropzoneProps()}>
                <input {...api.getHiddenInputProps()} />
                <span>Drag your file here (or)</span>
              </div>

              <button {...api.getTriggerProps()} className="cursor-pointer">
                Choose file
              </button>
            </div>
          </div>
        )}

        <ul {...api.getItemGroupProps()} className="">
          {api.acceptedFiles.map((file) => (
            <li
              key={file.name}
              {...api.getItemProps({ file })}
              className="flex flex-col gap-4 items-center"
            >
              <img
                src={preview ?? ''}
                alt=""
                className="w-48 rounded-md object-cover"
              />
              <div className="flex items-center gap-2">
                <div {...api.getItemNameProps({ file })}>{file.name}</div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="cursor-pointer"
                  {...api.getItemDeleteTriggerProps({ file })}
                >
                  <TrashIcon className="size-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {f && (
          <div>
            <div className="flex gap-4 items-center">
              <label htmlFor="alt" className="text-sm font-medium">
                Alt Text
              </label>
              <input
                type="text"
                id="alt"
                placeholder="Alt text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center">
              <label htmlFor="caption" className="text-sm font-medium">
                Caption
              </label>
              <input
                type="text"
                id="caption"
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="default"
            onClick={async () => {
              let f = api.acceptedFiles[0];

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

              let updateRes = await fetchClient.POST(
                '/api/v2/pois/drafts/{id}/media',
                {
                  params: {
                    path: {
                      id: draft.id,
                    },
                  },
                  body: {
                    id: res.data.id,
                    alt: alt,
                    caption: caption,
                    fileName: res.data.fileName,
                    size: 0,
                  },
                },
              );

              if (updateRes.error) {
                toast.error(updateRes.error.title ?? 'Something went wrong');
                return;
              }

              toast.success('Media uploaded');
              window.location.reload();
            }}
          >
            Upload
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
