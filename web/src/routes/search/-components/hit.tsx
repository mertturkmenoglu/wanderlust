import Card from '@/components/blocks/autocomplete/card';

type Props = {
  hit: {
    id: string;
    location: [number, number];
    name: string;
    poi: {
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
      media: Array<{
        id: number;
        url: string;
      }>;
    };
  };
};

export default function Hit({ hit }: Readonly<Props>) {
  return (
    <Card
      id={hit.id}
      name={hit.name}
      categoryName={hit.poi.category.name}
      image={hit.poi.media[0]?.url ?? ''}
      city={hit.poi.address.city.name}
      state={hit.poi.address.city.state.name}
      isCardClickable={false}
    />
  );
}
