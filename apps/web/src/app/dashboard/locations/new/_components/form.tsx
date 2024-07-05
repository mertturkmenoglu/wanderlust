'use client';

import Dnd from '@/components/blocks/FileUploadDnd';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/use-categories';
import { uploadImages } from '@/lib/api';
import { cn, getDims, mapImagesToMedia } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import Tags from './tags';
import { useCreateLocation } from './use-create-location';
import { FormInput, useLocationForm } from './use-form';
import { useTags } from './use-tags';
import { useUpload } from './use-upload';
import { useCountries } from '@/hooks/use-countries';
import { useStates } from '@/hooks/use-states';
import { useCities } from '@/hooks/use-cities';

function NewLocationForm() {
  const [countryId, setCountryId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string[]>([]);

  const categories = useCategories();
  const countries = useCountries();
  const states = useStates(countryId);
  const cities = useCities(countryId, stateId);
  const createLocation = useCreateLocation();
  const form = useLocationForm();
  const tagsApi = useTags();
  const [capi, fapi] = useUpload();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setFileError([]);

    if (fapi.acceptedFiles.length === 0) {
      setFileError(['Please upload at least one image']);
      return;
    }

    const res = await uploadImages(fapi.acceptedFiles, 'locations');

    if (res.length !== fapi.acceptedFiles.length) {
      setFileError((prev) => [...prev, 'Failed to upload one or more file(s)']);
      return;
    }

    const dims = await getDims(fapi.acceptedFiles);

    if (dims.length !== fapi.acceptedFiles.length) {
      setFileError((prev) => [
        ...prev,
        'Failed to get dimensions for one or more file(s)',
      ]);
      return;
    }

    createLocation.mutate({
      address: {
        lat: data.lat,
        long: data.long,
        line1: data.line1,
        line2: data.line2 ?? '',
        country: countries.data?.find((c) => c.id === countryId)?.iso2 ?? '',
        state: states.data?.find((s) => s.id === stateId)?.stateCode ?? '',
        city: cities.data?.find((c) => c.id === cityId)?.name ?? '',
        postalCode: data.postalCode ?? '',
      },
      name: data.name,
      description: data.description,
      phone: data.phone,
      website: data.website,
      accessibilityLevel: data.accessibilityLevel,
      priceLevel: data.priceLevel,
      hasWifi: data.hasWifi,
      tags: tagsApi.value,
      categoryId: data.categoryId,
      media: mapImagesToMedia(res, fapi.acceptedFiles, dims),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 max-w-4xl space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of the location"
                  {...field}
                />
              </FormControl>
              <FormDescription>Name of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the location"
                  {...field}
                />
              </FormControl>
              <FormDescription>Name of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (000) 000 0000"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="priceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Level</FormLabel>
                <FormControl>
                  <>
                    <Slider
                      defaultValue={[1]}
                      max={5}
                      min={1}
                      step={1}
                      value={[field.value]}
                      onValueChange={(v) => {
                        field.onChange(v[0]);
                      }}
                    />

                    <div>You selected: {field.value}</div>
                  </>
                </FormControl>
                <FormDescription>
                  1 is cheap, 5 is expensive (Optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessibilityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accessibility Level</FormLabel>
                <FormControl>
                  <>
                    <Slider
                      defaultValue={[1]}
                      max={5}
                      min={1}
                      step={1}
                      value={[field.value]}
                      onValueChange={(v) => {
                        field.onChange(v[0]);
                      }}
                    />

                    <div>You selected: {field.value}</div>
                  </>
                </FormControl>
                <FormDescription>
                  1 is low 5 is highly accessible (Optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hasWifi"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Has WiFi connection</FormLabel>
                <FormDescription>
                  Indicates there is an option to connect to WiFi (Optional,
                  defaults to false)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(v) => {
                  field.onChange(+v);
                }}
                defaultValue={
                  field.value === undefined ? undefined : `${field.value}`
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(categories.data?.data ?? []).map((c) => (
                    <SelectItem
                      value={`${c.id}`}
                      key={c.id}
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <FormLabel>Tags</FormLabel>
          <Tags api={tagsApi} />
        </div>

        <div
          id="address"
          className="space-y-8"
        >
          <h3 className="my-8 text-lg font-bold tracking-tight">Address</h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? (countries.data ?? []).find(
                                (c) => c.iso2 === field.value
                              )?.name
                            : 'Select country'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {(countries.data ?? []).map((country) => (
                              <CommandItem
                                value={country.iso2}
                                key={country.id}
                                onSelect={() => {
                                  form.setValue('country', country.iso2);
                                  setCountryId(country.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    country.iso2 === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a country</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? (states.data ?? []).find(
                                (c) => c.stateCode === field.value
                              )?.name
                            : 'Select state'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {(states.data ?? []).map((state) => (
                              <CommandItem
                                value={state.stateCode}
                                key={state.id}
                                onSelect={() => {
                                  form.setValue('state', state.stateCode);
                                  setStateId(state.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    state.stateCode === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {state.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a state</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? (cities.data ?? []).find(
                                (c) => c.name === field.value
                              )?.name
                            : 'Select city'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {(cities.data ?? []).map((city) => (
                              <CommandItem
                                value={city.name}
                                key={city.id}
                                onSelect={() => {
                                  form.setValue('city', city.name);
                                  setCityId(city.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    city.name === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a city</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address line 1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Address line 1 (e.g., street, PO Box, or company name).
                  (Required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address line 2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Address line 2 (e.g., apartment, suite, unit, or building).
                    (Optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Postal Code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ZIP or postal code. (Optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Latitude"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Latitude (Required)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Longitude"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Longitude (Required)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Dnd
          capi={capi}
          fapi={fapi}
        />

        {fileError.length > 0 && (
          <div>
            {fileError.map((error, i) => (
              <div
                key={i}
                className="text-destructive"
              >
                {error}
              </div>
            ))}
          </div>
        )}

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export default NewLocationForm;
