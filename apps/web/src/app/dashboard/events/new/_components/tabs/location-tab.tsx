'use client';

import { Button } from '@/components/ui/button';
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
import { useCities } from '@/hooks/use-cities';
import { useCountries } from '@/hooks/use-countries';
import { useStates } from '@/hooks/use-states';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  country: z.string().length(2),
  city: z.string().min(1),
  state: z.string().optional(),
  line1: z.string().min(1).max(255),
  line2: z.string().optional(),
  postalCode: z.string().optional(),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
});

type FormInput = z.infer<typeof schema>;

export default function LocationTab() {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const [countryId, setCountryId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  const countries = useCountries();
  const states = useStates(countryId);
  const cities = useCities(countryId, stateId);

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  const onError: SubmitErrorHandler<FormInput> = (errors) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-4xl space-y-8"
      >
        {/* Location */}
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
      </form>
    </Form>
  );
}
