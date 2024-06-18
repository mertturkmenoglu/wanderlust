import { Address } from '#/db';
import Card from '@/components/blocks/Autocomplete/card';
import { Media } from '@/lib/types';

type Props = {
  hit: {
    id: string;
    name: string;
    media: Media[];
    categoryId: number;
    address: Address;
  };
};

export default function Hit({ hit }: Props) {
  return (
    <Card
      id={hit.id}
      categoryName=""
      city={hit.address.city}
      image={hit.media[0].url}
      name={hit.name}
      state={hit.address.state ?? ''}
    />
  );
}
