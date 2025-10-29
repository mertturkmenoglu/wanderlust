import { InputError } from '@/components/kit/input-error';
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
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { isAfter } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    title: z.string().min(1).max(128),
    date: z.string(),
  })
  .superRefine((data, ctx) => {
    if (isAfter(data.date, new Date())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be in the past',
        path: ['date'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

export function CreateDialog() {
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const createDiaryEntryMutation = api.useMutation('post', '/api/v2/diary/', {
    onSuccess: async (res) => {
      toast.success('Diary entry created');
      await invalidator.invalidate();
      await navigate({
        to: `/diary/${res.diary.id}`,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon className="mr-2 size-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new diary entry</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm w-full">
          <form
            onSubmit={form.handleSubmit((data) => {
              createDiaryEntryMutation.mutate({
                body: {
                  title: data.title,
                  date: new Date(data.date).toISOString(),
                },
              });
            })}
            className="w-full"
          >
            <div className="mt-4">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Italy Trip with the family in 2022"
                autoComplete="off"
                className="mt-1"
                {...form.register('title')}
              />
              <InputError error={form.formState.errors.title} />
            </div>

            <div className="mt-4">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className="mt-1"
                {...form.register('date')}
              />
              <InputError error={form.formState.errors.date} />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
