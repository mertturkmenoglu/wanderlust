import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Rating } from '@/components/kit/rating';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetchClient } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, Link } from '@tanstack/react-router';
import * as fileUpload from '@zag-js/file-upload';
import { normalizeProps, useMachine } from '@zag-js/react';
import { PencilIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { useContext, useId, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(5).max(2048),
});

type FormInput = z.infer<typeof schema>;

function useUpload() {
  const service = useMachine(fileUpload.machine, {
    id: useId(),
    accept: ['image/jpeg', 'image/png'],
    maxFiles: 4,
    maxFileSize: 1024 * 1024 * 10, // 5MB
  });

  return fileUpload.connect(service, normalizeProps);
}

export default function CreateReviewDialog() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const [rating, setRating] = useState(0);
  const auth = useContext(AuthContext);
  const isAuthenticated = !auth.isLoading && auth.user;
  const up = useUpload();
  const files = up.acceptedFiles;
  const previews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link to="/sign-in">
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
        </Link>
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm">
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Add a review</AlertDialogTitle>
          <AlertDialogDescription>
            Add a review to {poi.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="sr-only">Rating</span>
            <Rating
              id="rating"
              defaultValue={0}
              onChange={(v) => setRating(v.value)}
              disabled={false}
              starsClassName="size-8"
            />
          </div>

          <div>
            <Label htmlFor="content">Review</Label>
            <Textarea
              id="content"
              rows={5}
              placeholder="Leave a review"
              {...form.register('content')}
            />
            <InputInfo text={lengthTracker(form.watch('content'), 2048)} />
            <InputError error={form.formState.errors.content} />
          </div>

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
                        {...up.getTriggerProps()}
                        className="cursor-pointer"
                      >
                        Choose file
                      </button>
                      <div className="text-xs">
                        PNG or JPEG files up to 5MB each.
                      </div>
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
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const reviewRes = await fetchClient.POST('/api/v2/reviews/', {
                body: {
                  content: form.getValues('content'),
                  poiId: poi.id,
                  rating: rating,
                },
              });

              if (reviewRes.error) {
                toast.error(reviewRes.error.title ?? 'Something went wrong');
                return;
              }

              for (const file of files) {
                let ext = file.name.split('.').at(-1);

                if (!ext) {
                  toast.error('Invalid file type');
                  return;
                }

                if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
                  toast.error('Invalid file type');
                  return;
                }

                const res = await fetchClient.GET('/api/v2/images/upload/', {
                  params: {
                    query: {
                      bucket: 'reviews',
                      fileExt: ext,
                    },
                  },
                });

                if (res.error) {
                  toast.error(res.error.title ?? 'Something went wrong');
                  return;
                }

                const uploadRes = await fetch(res.data.url, {
                  method: 'PUT',
                  body: file,
                });

                if (!uploadRes.ok) {
                  toast.error('Something went wrong');
                  return;
                }

                const updateRes = await fetchClient.POST(
                  '/api/v2/reviews/{id}/media',
                  {
                    params: {
                      path: {
                        id: reviewRes.data.review.id,
                      },
                    },
                    body: {
                      fileName: res.data.fileName,
                      id: res.data.id,
                      size: 0,
                    },
                  },
                );

                if (updateRes.error) {
                  toast.error(updateRes.error.title ?? 'Something went wrong');
                  return;
                }
              }

              toast.success('Review added');
              window.location.reload();
            }}
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
