import { InputError } from '@/components/kit/input-error';
import { InputInfo } from '@/components/kit/input-info';
import { Spinner } from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { UpdateImage } from './-update-image';

const schema = z.object({
  fullName: z.string().min(1).max(128),
  bio: z.string().max(255).nullable(),
  pronouns: z.string().max(32).nullable(),
  website: z.string().max(255).nullable(),
});

export const Route = createFileRoute('/settings/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  // oxlint-disable-next-line no-non-null-assertion
  const user = auth.user!;
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user.fullName,
      bio: user.bio ?? '',
    },
  });

  const mutation = api.useMutation('patch', '/api/v2/users/profile', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Profile updated');
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight first:mt-0">
        Profile
      </h2>

      <div className="grid grid-cols-3 gap-4 mt-4 items-center">
        <Label>Profile Image</Label>
        <div className="col-span-2 flex">
          <UpdateImage
            fullName={user.fullName}
            image={user.profileImage}
            fallbackImage="/profile.png"
            action="profile"
          />
        </div>

        <Label>Banner Image</Label>
        <div className="col-span-2 flex">
          <UpdateImage
            fullName={user.fullName}
            image={user.bannerImage}
            fallbackImage="https://i.imgur.com/EwvUEmR.jpg"
            action="banner"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <form
        onSubmit={form.handleSubmit((data) => {
          let bio = data.bio === '' ? null : data.bio;

          mutation.mutate({
            body: {
              fullName: data.fullName,
              bio,
            },
          });
        })}
        className="mt-4 grid grid-cols-3 gap-4 md:gap-8"
      >
        <Label
          htmlFor="name"
          className="mt-2"
        >
          Full Name
        </Label>
        <div className="col-span-2">
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            {...form.register('fullName')}
          />
          <InputError error={form.formState.errors.fullName} />
        </div>

        <Label
          htmlFor="bio"
          className="mt-2"
        >
          Bio
        </Label>
        <div className="col-span-2">
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            autoComplete="off"
            rows={6}
            {...form.register('bio')}
          />
          <InputInfo text="Let us know about you" />
          <InputError error={form.formState.errors.bio} />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty || mutation.isPending}
        >
          {mutation.isPending && <Spinner className="mr-2" />}
          Update
        </Button>
      </form>
    </div>
  );
}
