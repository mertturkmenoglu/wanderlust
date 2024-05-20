"use client";

import { createLocationSchema } from "#/routes/dto/create-location";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  createNewLocation,
  getCategories,
  searchAddress,
  type Address,
} from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormInput = z.infer<typeof createLocationSchema>;

function NewLocationForm() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationKey: ["new-location"],
    mutationFn: async (payload: FormInput) => createNewLocation(payload),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const search = useMutation({
    mutationKey: ["search-address", q],
    mutationFn: async () => searchAddress(q),
    onSuccess: (r) => {
      setRes(r);
    },
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(createLocationSchema),
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
    if (address === null) {
      console.error("Address not selected");
      return;
    }
    mutation.mutate({
      ...data,
      addressId: address.id,
    });
  };

  return (
    <div>
      <div className="flex flex-col max-w-xl space-y-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search address"
          className="border border-black rounded-md py-1"
        />
        <button
          type="button"
          onClick={() => {
            search.mutate();
          }}
          className="bg-black text-white px-4 py-1 rounded-md"
        >
          Search
        </button>
        {res.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setAddress(a);
              form.setValue("addressId", a.id);
            }}
            type="button"
          >
            <pre>{JSON.stringify(a, null, 2)}</pre>
          </button>
        ))}
      </div>
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
    </div>
  );
}

export default NewLocationForm;
