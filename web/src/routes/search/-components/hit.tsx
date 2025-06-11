import { Card } from '@/components/blocks/autocomplete/card';

export type Props = {
  hit: {
    id: string;
    location: [number, number];
    name: string;
    poi: {
      id: string;
      address: {
        city: {
          id: number;
          name: string;
          country: {
            name: string;
          };
          state: {
            name: string;
          };
        };
      };
      amenities: unknown[];
      category: {
        id: number;
        image: string;
        name: string;
      };
      images: {
        id: number;
        url: string;
      }[];
    };
  };
};

export function Hit({ hit }: Readonly<Props>) {
  return (
    <Card
      id={hit.poi.id}
      name={hit.name}
      categoryName={hit.poi.category.name}
      image={hit.poi.images[0]?.url ?? ''}
      city={hit.poi.address.city.name}
      state={hit.poi.address.city.state.name}
      isCardClickable={false}
    />
  );
}
