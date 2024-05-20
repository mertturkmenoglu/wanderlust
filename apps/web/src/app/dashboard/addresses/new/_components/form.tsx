"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { createAddressSchema } from "#/routes/dto/create-address";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createNewAddress } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type FormInput = z.infer<typeof createAddressSchema>;

function NewAddressForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["new-address"],
    mutationFn: async (payload: FormInput) => createNewAddress(payload),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl"
      >
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormDescription>
                City, district, suburb, town, or village. Required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormDescription>
                Two-letter country code (ISO 3166-1 alpha-2). Required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street, PO BOX, company name, etc."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Address line 1 (e.g., street, PO Box, or company name). Required
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment, suite, unit, building, etc."
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                Address line 2 (e.g., apartment, suite, unit, or building)
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
                  placeholder="ZIP or postal code"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>ZIP or postal code. (Optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  placeholder="State, county, province, or region"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                State, county, province, or region. (Optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  placeholder="Latitude"
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>Latitude. Required.</FormDescription>
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
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>Longitude. Required.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export default NewAddressForm;
