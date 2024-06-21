import CreateReviewDialog from './_components/create-review-dialog';
import ReviewList from './_components/list';

type Props = {
  name: string;
  locationId: string;
};

export default function Reviews({ name, locationId }: Props) {
  return (
    <div className="mb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <CreateReviewDialog
          name={name}
          locationId={locationId}
        />
      </div>

      <ReviewList locationId={locationId} />
    </div>
  );
}
