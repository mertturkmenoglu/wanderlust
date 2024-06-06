'use client';

import CollapsibleText from '@/components/blocks/CollapsibleText';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Rating } from '@/components/ui/rating';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical, FlagIcon, ThumbsUp, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useDeleteReview } from './delete-review';

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const { user } = useUser();
  const belongsToCurrentUser = user?.username === review.user.username;
  const deleteMutation = useDeleteReview({
    locationId: review.locationId,
  });
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <Card key={review.id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Link
            href={`/user/${review.user.username}`}
            className="flex flex-row items-start space-x-4"
          >
            <div>
              <img
                src={review.user.image ?? ''}
                alt={review.user.username}
                className="size-12 rounded-full"
              />
            </div>
            <div className="!mt-0">
              <CardTitle className="line-clamp-1 capitalize">
                {review.user.firstName} {review.user.lastName}
              </CardTitle>
              <CardDescription className="flex flex-col">
                <span>{review.user.username}</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </CardDescription>
            </div>
          </Link>
        </div>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="block"
            >
              <Button
                className="block"
                variant="ghost"
              >
                <EllipsisVertical className="size-6" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="mr-4 w-32 space-y-2 p-2"
              align="end"
            >
              <DropdownMenuItem className="cursor-pointer p-0">
                <Button
                  className="flex w-full justify-start hover:no-underline"
                  variant="link"
                  size="sm"
                >
                  <FlagIcon className="mr-2 size-4" />
                  Report
                </Button>
              </DropdownMenuItem>
              {belongsToCurrentUser && (
                <DialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer p-0">
                    <Button
                      className="flex w-full justify-start text-destructive hover:no-underline"
                      variant="link"
                      size="sm"
                      type="button"
                    >
                      <TrashIcon className="mr-2 size-4" />
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this review?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => deleteMutation.mutate(review.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <CollapsibleText text={review.comment} />

        <div className="mt-2 flex items-center space-x-2">
          <span className="text-sm font-bold">Rating:</span>
          <Rating
            disabled={true}
            defaultValue={review.rating}
            onChange={() => {}}
            id={review.id}
          />
        </div>

        <div className="mt-2 flex items-center">
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={true}
          >
            <ThumbsUp className="size-4 text-primary" />
          </Button>
          <span className="text-sm">{review.likeCount} likes</span>
        </div>
      </CardContent>

      <CardFooter>
        <ScrollArea>
          <div className="mb-4 flex gap-2">
            {review.media.map((m, i) => (
              <button
                key={m.url}
                className="aspect-square w-32"
                onClick={() => {
                  setImageIndex(() => {
                    setOpen(true);
                    return i;
                  });
                }}
              >
                <img
                  src={m.url}
                  alt={m.alt}
                  className="aspect-square w-32 object-cover"
                />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardFooter>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={review.media.map((m) => ({
          src: m.url,
        }))}
        carousel={{
          finite: true,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
        index={imageIndex}
      />
    </Card>
  );
}
