import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api, fetchClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { UploadIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  id: string;
};

export default function NewImageDialog({ id }: Props) {
  const invalidator = useInvalidator();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => {
    if (file === null) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const uploadMutation = api.useMutation('post', '/api/v2/diary/{id}/media', {
    onSuccess: async () => {
      toast.success('Image updated');
      await invalidator.invalidate();
      setFile(null);
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="px-0"
          onClick={() => setOpen(true)}
        >
          New Diary Media
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>New Diary Media</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-x-2 text-sm gap-4">
          {preview === null ? (
            <div className="rounded-md w-80 aspect-video bg-muted"></div>
          ) : (
            <img
              src={preview}
              alt={''}
              className={cn('mt-4 rounded-md object-cover w-80 aspect-video')}
            />
          )}

          <div className="flex flex-col">
            <label
              htmlFor="diary-image"
              className={cn(
                'mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-primary/10',
                'text-primary hover:bg-primary/20 cursor-pointer',
                'transition-colors flex items-center gap-4 justify-center',
              )}
            >
              <UploadIcon className="size-4 text-primary" />
              {!file ? `Upload an image` : 'Change selection'}
            </label>
            <div className="text-xs text-muted-foreground mt-2">
              PNG, JPEG, GIF, and WebP are supported. Maximum 5MB.
            </div>
            <input
              id="diary-image"
              type="file"
              name="files"
              accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
              placeholder="Upload an image"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFile(file);
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            variant="default"
            onClick={async () => {
              if (!file) {
                return;
              }

              const form = new FormData();

              form.append('files', file);

              const ext = file.type.split('/')[1];

              if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
                toast.error('Only PNG, JPG, and JPEG are supported');
                return;
              }

              // Get presigned URL
              const res = await fetchClient.GET('/api/v2/images/upload/', {
                params: {
                  query: {
                    bucket: 'diaries',
                    fileExt: ext,
                  },
                },
              });

              if (res.error) {
                toast.error('Something went wrong');
                return;
              }

              // Upload file to S3
              const s3Res = await fetch(res.data.url, {
                method: 'PUT',
                body: file,
              });

              if (!s3Res.ok) {
                toast.error('Something went wrong');
                return;
              }

              uploadMutation.mutate({
                params: {
                  path: {
                    id,
                  },
                },
                body: {
                  id: res.data.id,
                  fileName: res.data.id + '.' + ext,
                  size: 0,
                },
              });
            }}
            disabled={!file || uploadMutation.isPending}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
