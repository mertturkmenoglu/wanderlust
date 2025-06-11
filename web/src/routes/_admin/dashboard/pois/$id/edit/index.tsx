import { Spinner } from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { lengthTracker } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(2048),
  phone: z.string().optional(),
  website: z.string().optional(),
  priceLevel: z.number().min(1).max(5),
  accessibilityLevel: z.number().min(1).max(5),
  categoryId: z.number(),
});

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();
  const invalidator = useInvalidator();
  const {
    data: { categories },
  } = api.useSuspenseQuery('get', '/api/v2/categories/');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: poi.name,
      description: poi.description,
      phone: poi.phone ?? undefined,
      website: poi.website ?? undefined,
      priceLevel: poi.priceLevel,
      accessibilityLevel: poi.accessibilityLevel,
      categoryId: poi.categoryId,
    },
  });

  const updateInfoMutation = api.useMutation(
    'patch',
    '/api/v2/pois/{id}/info',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Point of interest updated');
      },
    },
  );

  return (
    <div>
      <h3 className="my-4 text-lg font-medium">
        Edit Point of Interest General Information
      </h3>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateInfoMutation.mutate({
              params: {
                path: {
                  id: poi.id,
                },
              },
              body: {
                ...data,
                phone: data.phone ?? null,
                website: data.website ?? null,
              },
            });
          })}
          className="mt-8 grid grid-cols-1 gap-4 px-0 mx-auto md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="description"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {lengthTracker(form.watch('description'), 2048)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (000) 000 0000"
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>
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
                    type="url"
                    placeholder="https://example.com"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
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
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an accessibility level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem
                        key={level}
                        value={level.toString()}
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>1 is low, 5 is high</FormDescription>
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
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a price level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem
                        key={level}
                        value={level.toString()}
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>1 is low, 5 is high</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full flex justify-end">
            <Button disabled={updateInfoMutation.isPending}>
              {updateInfoMutation.isPending && <Spinner className="size-4" />}
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
