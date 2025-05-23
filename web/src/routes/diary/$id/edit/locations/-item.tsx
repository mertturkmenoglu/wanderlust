import { Card } from '@/components/ui/card';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Actions from './-actions';
import Description from './-description';
import type { FormInput } from './-schema';

type Props = {
  index: number;
};

export default function Item({ index }: Props) {
  const form = useFormContext<FormInput>();
  const array = useFieldArray({
    control: form.control,
    name: 'locations',
  });
  const location = array.fields[index]!;

  return (
    <div className="flex flex-col">
      <Actions
        index={index}
        className="ml-auto mt-4"
      />

      <Card className="mt-1 p-0 gap-0">
        <img
          src={location.image}
          alt=""
          className="aspect-[7/2] w-full rounded-t-md object-cover"
        />

        <div className="p-4">
          <div className="line-clamp-1 text-lg font-semibold capitalize leading-none tracking-tight">
            {location.name}
          </div>
          <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
            {location.city} / {location.state}
          </div>

          <div className="text-sm font-semibold leading-none tracking-tight text-primary">
            {location.categoryName}
          </div>
        </div>

        <Description index={index} />
      </Card>
    </div>
  );
}
