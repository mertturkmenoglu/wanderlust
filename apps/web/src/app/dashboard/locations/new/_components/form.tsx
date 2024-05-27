"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { CreateLocationDto } from "#/routes/locations/dto";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, rpc } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type FormInput = CreateLocationDto;

const schema = z.object({
  name: z.string().min(1),
  address: z.object({
    country: z.string().length(2),
    city: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    postalCode: z.string().optional(),
    state: z.string().optional(),
    lat: z.number(),
    long: z.number(),
  }),
  phone: z.string(),
  website: z.string().optional(),
  priceLevel: z.number().optional(),
  accessibilityLevel: z.number().optional(),
  hasWifi: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.number(),
});

function NewLocationForm() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => rpc(() => api.categories.$get()),
    staleTime: 10 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationKey: ["new-location"],
    mutationFn: async (payload: FormInput) =>
      rpc(() =>
        api.locations.$post({
          json: payload,
        })
      ),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: null,
      website: null,
      priceLevel: 1,
      accessibilityLevel: 1,
      hasWifi: false,
      categoryId: 1,
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    mutation.mutate({
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl mt-16"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the location" {...field} />
              </FormControl>
              <FormDescription>Name of the location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="priceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Level</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
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
                <Input
                  placeholder="5"
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>
                1 is low 5 is highly accessible (Optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {(categories ?? []).map((c) => (
                    <SelectItem value={`${c.id}`} key={c.id}>
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

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export default NewLocationForm;
