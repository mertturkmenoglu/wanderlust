import InputError from '@/components/kit/input-error';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquarePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const visibility = ['public', 'friends', 'private'] as const;

type Visibility = (typeof visibility)[number];

const visibilityOptions: Array<{
  label: string;
  value: Visibility;
  info: string;
}> = [
  {
    label: 'Public',
    value: 'public',
    info: 'Anyone can see your trip',
  },
  {
    label: 'Friends',
    value: 'friends',
    info: 'Only your friends can see your trip',
  },
  {
    label: 'Private',
    value: 'private',
    info: 'Only you can see your trip',
  },
];

const schema = z.object({
  title: z.string().min(1).max(128),
  visibility: z.enum(visibility),
});

export function CreateDialog() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg">
          <SquarePlusIcon className="mr-2 size-4" />
          Create trip
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Plan your next trip</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm w-full">
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
            })}
            className="w-full"
          >
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              bruh
              <Input
                type="text"
                id="title"
                placeholder="My Awesome Trip"
                autoComplete="off"
                className="mt-1"
                {...form.register('title')}
              />
              <InputError error={form.formState.errors.title} />
            </div>

            <div className="mt-4">
              <Controller
                name="visibility"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div>
                      <Label htmlFor="visibility">Visibility</Label>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <SelectTrigger id="visibility" className="mt-1 w-full">
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {visibilityOptions.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputInfo
                        text={
                          visibilityOptions.find(
                            (op) => op.value === field.value,
                          )?.info ?? ''
                        }
                        className="mt-1"
                      />
                    </div>
                  );
                }}
              />
              <InputError error={form.formState.errors.visibility} />
            </div>
          </form>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
