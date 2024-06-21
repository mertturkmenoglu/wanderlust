'use client';

import Dnd from '@/components/blocks/FileUploadDnd';
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
import { uploadImages } from '@/lib/api';
import { getDims, mapImagesToMedia } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postReview } from './helpers';
import { useUpload } from './use-upload';

type Props = {
  name: string;
  locationId: string;
};

const schema = z.object({
  comment: z.string().min(1).max(256),
  rating: z.number().int().min(1).max(5),
});

type FormInput = z.infer<typeof schema>;

export default function CreateReview({ name, locationId }: Props) {
  const [error, setError] = useState<string[]>([]);
  const [capi, fapi] = useUpload();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      comment: '',
      rating: 0,
    },
  });

  async function createReview({ comment, rating }: FormInput) {
    setError([]);

    const count = fapi.acceptedFiles.length;
    const urls: string[] = [];

    if (count > 0) {
      const res = await uploadImages(fapi.acceptedFiles, 'reviews');
      urls.push(...res);
    }

    if (count > 0 && urls.length !== count) {
      setError((prev) => [...prev, 'Failed to upload one or more file(s)']);
      return;
    }

    const dims = await getDims(fapi.acceptedFiles);

    if (dims.length !== count) {
      setError((prev) => [
        ...prev,
        'Failed to get dimensions for one or more file(s)',
      ]);
      return;
    }

    try {
      await postReview({
        comment,
        rating,
        locationId,
        media: mapImagesToMedia(urls, fapi.acceptedFiles, dims),
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
      setError((prev) => [...prev, 'Failed to create review']);
    }
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Your Review</DialogTitle>
        <DialogDescription>Share your experience with others</DialogDescription>
      </DialogHeader>
      <form
        className="grid gap-4 py-4"
        onSubmit={form.handleSubmit(createReview)}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-bold capitalize">{name}</p>
          <Rating
            id="review"
            defaultValue={form.getValues('rating')}
            onChange={(v) => form.setValue('rating', v.value)}
          />
        </div>
        <div className="">
          <Textarea
            placeholder="Write your review here..."
            rows={4}
            {...form.register('comment')}
          />
        </div>

        <Dnd
          capi={capi}
          fapi={fapi}
        />

        <div className="flex justify-center text-center">
          {error.length > 0 && (
            <ul className="space-y-1 text-sm text-red-500">
              {error.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter className="flex !justify-center">
          <Button type="submit">Create review</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
