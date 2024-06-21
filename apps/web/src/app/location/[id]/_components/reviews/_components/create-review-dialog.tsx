'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@clerk/nextjs';
import CreateReview from './create-review';

type Props = {
  name: string;
  locationId: string;
};

export default function CreateReviewDialog({ name, locationId }: Props) {
  const { isSignedIn } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={!isSignedIn}
        >
          Create a review
        </Button>
      </DialogTrigger>
      <CreateReview
        name={name}
        locationId={locationId}
      />
    </Dialog>
  );
}
