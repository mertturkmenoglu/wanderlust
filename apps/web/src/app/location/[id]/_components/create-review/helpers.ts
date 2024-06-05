import { api, rpc } from '@/lib/api';
import { CreateMediaDto } from '@/lib/utils';

export async function postReview({
  comment,
  rating,
  locationId,
  media,
}: {
  comment: string;
  rating: number;
  locationId: string;
  media: CreateMediaDto[];
}) {
  return rpc(() => {
    return api.reviews.$post({
      json: {
        comment,
        rating,
        locationId,
        media,
      },
    });
  });
}
