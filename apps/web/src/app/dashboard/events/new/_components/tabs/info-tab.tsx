'use client';

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
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1024),
  phone: z.string().optional(),
  website: z.string().optional(),
  priceLevel: z.number().min(1).max(5),
  accessibilityLevel: z.number().min(1).max(5),
});

type FormInput = z.infer<typeof schema>;

export default function InfoTab() {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      priceLevel: 1,
      accessibilityLevel: 1,
    },
  });

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of the event"
                  {...field}
                />
              </FormControl>
              <FormDescription>Required</FormDescription>
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
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormDescription>Required</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone + Website */}
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

        {/* Price + A11Y Levels */}
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
      </form>
    </Form>
  );
}
