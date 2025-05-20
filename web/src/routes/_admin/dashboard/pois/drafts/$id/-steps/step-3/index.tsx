import InputError from '@/components/kit/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, type SubmitHandler } from 'react-hook-form';
import StepsNavigation from '../steps-navigation';
import { useUpdateDraftMutation } from '../use-update-draft';
import { useStep3Form } from './hooks';
import type { FormInput } from './schema';

export default function Step3() {
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const { draft: d } = route.useLoaderData();
  let draft = d as any;
  const form = useStep3Form(draft);
  const mutation = useUpdateDraftMutation(draft, 3);
  const qAmenities = api.useQuery('get', '/api/v2/amenities/');

  if (!qAmenities.data || !qAmenities.data.amenities) {
    return <></>;
  }

  const amenities = qAmenities.data.amenities;

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
        className="mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <Controller
            name="amenities"
            control={form.control}
            render={() => {
              return (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-2">
                  {amenities.map((amenity) => (
                    <Controller
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        return (
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      amenity.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity.id,
                                      ),
                                    );
                              }}
                            />

                            <Label className="font-normal">
                              {amenity.name}
                            </Label>
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              );
            }}
          />
          <InputError error={form.formState.errors.amenities?.root} />
        </div>

        <StepsNavigation
          draftId={draft.id}
          step={3}
        />
      </form>
    </div>
  );
}
