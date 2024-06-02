import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CreateReview from '../create-review';
import ReviewList from './list';

type Props = {
  name: string;
  locationId: string;
};

export default function Reviews({ name, locationId }: Props) {
  return (
    <div className="mb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Create a review</Button>
          </DialogTrigger>
          <CreateReview
            name={name}
            locationId={locationId}
          />
        </Dialog>
      </div>

      <ReviewList locationId={locationId} />
    </div>
  );
}