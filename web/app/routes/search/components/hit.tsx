import Card from "~/components/blocks/autocomplete/card";

type Props = {
  hit: {
    id: string;
    location: [number, number];
    name: string;
    poi: {
      Address: unknown;
      Amenities: unknown[];
      Category: {
        ID: number;
        Image: string;
        Name: string;
      };
      City: {
        ID: number;
        Name: string;
        CountryName: string;
        StateName: string;
      };
      Media: Array<{
        ID: number;
        Url: string;
      }>;
      Poi: {
        ID: string;
        name: string;
        CategoryID: number;
        AddressID: number;
      };
    };
  };
};

export default function Hit({ hit }: Readonly<Props>) {
  return (
    <Card
      id={hit.poi.Poi.ID}
      name={hit.name}
      categoryName={hit.poi.Category.Name}
      image={hit.poi.Media[0].Url}
      city={hit.poi.City.Name}
      state={hit.poi.City.StateName}
      isCardClickable={false}
    />
  );
}
