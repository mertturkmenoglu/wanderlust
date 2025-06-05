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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api, fetchClient } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { AuthContext } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, Link } from '@tanstack/react-router';
import { PencilIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { doFileUpload, useUpload } from './hooks';
import { ImageUploadArea } from './image-upload';

const schema = z.object({
  content: z.string().min(5).max(2048),
});

export function CreateReviewDialog() {
  const auth = useContext(AuthContext);
  const isAuthenticated = !auth.isLoading && auth.user;

  if (!isAuthenticated) {
    return (
      <Button
        variant="default"
        size="sm"
        asChild
      >
        <Link to="/sign-in">
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
        </Link>
      </Button>
    );
  }

  return <Content />;
}

function Content() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const [rating, setRating] = useState(0);
  const up = useUpload();
  const files = up.acceptedFiles;
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const createReviewMutation = api.useMutation('post', '/api/v2/reviews/', {
    onSuccess: async (data) => {
      const ok = await doFileUpload(files, data.review.id);

      if (!ok) {
        toast.error('Something went wrong');
        return;
      }

      await invalidator.invalidate();
      form.reset();
      setRating(0);
      toast.success('Review added');
    },
    onError: async (err) => {
      toast.error(err.title ?? 'Something went wrong');
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
        >
          <PencilIcon className="size-4 mr-2" />
          <span>Add a review</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-xl">
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
              value={rating}
              onChange={(v) => {
                setRating(v.value);
              }}
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
              className="mt-1"
              {...form.register('content')}
            />
            <InputInfo text={lengthTracker(form.watch('content'), 2048)} />
            <InputError error={form.formState.errors.content} />
          </div>

          <ImageUploadArea up={up} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              // Ensure the user is logged in
              const res = await fetchClient.POST('/api/v2/auth/refresh');

              if (res.error) {
                toast.error('You must be logged in to create a review');
                return;
              }

              createReviewMutation.mutate({
                body: {
                  content: form.getValues('content'),
                  poiId: poi.id,
                  rating: rating,
                },
              });
            }}
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
