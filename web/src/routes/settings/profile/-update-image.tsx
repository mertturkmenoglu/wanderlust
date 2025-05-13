import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { api, fetchClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  image: string | null;
  fallbackImage: string;
  fullName: string;
  action: 'profile' | 'banner';
};

export default function UpdateImage({
  image,
  fallbackImage,
  fullName,
  action,
}: Props) {
  const [preview, setPreview] = useState(() =>
    image === null ? fallbackImage : image,
  );
  const [file, setFile] = useState<File | null>(null);
  const mutation = api.useMutation('post', '/api/v2/users/image/{type}', {
    onSuccess: () => {
      toast.success('Image updated');
      window.location.reload();
    },
  });

  return (
    <div className="max-w-xl flex gap-4 ml-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">Change {action} image</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Select a new {action === 'profile' ? 'profile' : 'banner'} image
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-x-2 text-sm gap-8">
            <div className="flex flex-col items-center gap-4">
              <img
                src={preview}
                alt={fullName}
                className={cn('mt-4 rounded-md object-cover', {
                  'w-48 aspect-square': action === 'profile',
                  'w-80 aspect-video': action === 'banner',
                })}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`${action}-image`}
                className={cn(
                  'mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-primary/10',
                  'text-primary hover:bg-primary/20 cursor-pointer',
                  'transition-colors flex items-center gap-4 justify-center',
                )}
              >
                <UploadIcon className="size-4 text-primary" />
                {!file ? `Upload a ${action} image` : 'Change selection'}
              </label>
              <div className="text-xs text-muted-foreground mt-2">
                PNG, JPEG, GIF, and WebP are supported. Maximum 5MB.
              </div>
              <input
                id={`${action}-image`}
                type="file"
                name="files"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                placeholder={`Upload a ${action} image`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
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
                      bucket:
                        action === 'profile'
                          ? 'profile-images'
                          : 'banner-images',
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

                mutation.mutate({
                  params: {
                    path: {
                      type: action,
                    },
                  },
                  body: {
                    id: res.data.id,
                    fileName: res.data.id + '.' + ext,
                  },
                });
              }}
              disabled={!file || mutation.isPending}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
