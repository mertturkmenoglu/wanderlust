import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, type SubmitHandler } from 'react-hook-form';
import StepsNavigation from '../steps-navigation';
import { useUpdateDraftMutation } from '../use-update-draft';
import { useStep2Form } from './hooks';
import type { FormInput } from './schema';

export default function Step2() {
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const { draft: d } = route.useLoaderData();
  let draft = d as any;
  const form = useStep2Form(draft);
  const qCities = api.useQuery('get', '/api/v2/cities/');
  const mutation = useUpdateDraftMutation(draft, 2);

  if (!qCities.data || !qCities.data.cities) {
    return <></>;
  }

  const cities = qCities.data.cities;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate({
      params: {
        path: {
          id: draft.id as string,
        },
      },
      body: {
        values: {
          ...draft,
          ...data,
        },
      },
    });
  };

  return (
    <div>
      <form
        className="mt-8 grid grid-cols-1 gap-4 px-0 mx-auto md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="city">City</Label>
          <Controller
            name="address.cityId"
            control={form.control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}, {city.state.name}, {city.country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a city" />
          <InputError error={form.formState.errors.address?.cityId} />
        </div>

        <div className="">
          <Label htmlFor="postal-code">Postal Code</Label>
          <Input
            type="text"
            id="postal-code"
            placeholder="Postal Code"
            autoComplete="postal-code"
            {...form.register('address.postalCode')}
          />
          <InputInfo text="Postal code" />
          <InputError error={form.formState.errors.address?.postalCode} />
        </div>

        <div className="">
          <Label htmlFor="line1">Line 1</Label>
          <Input
            type="text"
            id="line1"
            placeholder="Address line 1"
            autoComplete="address-line1"
            {...form.register('address.line1')}
          />
          <InputInfo text="Address line 1" />
          <InputError error={form.formState.errors.address?.line1} />
        </div>

        <div className="">
          <Label htmlFor="line2">Line 2</Label>
          <Input
            type="text"
            id="line2"
            placeholder="Address line 2"
            autoComplete="address-line2"
            {...form.register('address.line2')}
          />
          <InputInfo text="Address line 2" />
          <InputError error={form.formState.errors.address?.line2} />
        </div>

        <div className="">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            type="number"
            id="lat"
            placeholder="Latitude"
            autoComplete="off"
            step="any"
            {...form.register('address.lat', { valueAsNumber: true })}
          />
          <InputInfo text="Latitude" />
          <InputError error={form.formState.errors.address?.lat} />
        </div>

        <div className="">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            type="number"
            id="lng"
            placeholder="Longitude"
            step="any"
            autoComplete="off"
            {...form.register('address.lng', { valueAsNumber: true })}
          />
          <InputInfo text="Longitude" />
          <InputError error={form.formState.errors.address?.lng} />
        </div>

        <StepsNavigation draftId={draft.id} step={2} />
      </form>
    </div>
  );
}
