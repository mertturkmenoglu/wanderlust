'use client';

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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api, rpc } from '@/lib/api';
import { Profile } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const pronounGroups = [
  {
    label: 'Binary',
    options: [
      { value: 'he/him', label: 'He/Him' },
      { value: 'she/her', label: 'She/Her' },
    ],
  },
  {
    label: 'Normative Forms',
    options: [
      { value: 'they/them/themselves', label: 'They/Them/Themselves' },
      { value: 'they/them/themself', label: 'They/Them/Themself' },
      { value: 'it/its', label: 'It/Its' },
      { value: "one/one's", label: "One/One's" },
    ],
  },
  {
    label: 'Popular Neopronouns',
    options: [
      { value: 'ae/aer', label: 'Ae/Aer' },
      { value: 'ey/em', label: 'Ey/Em' },
      { value: 'fae/faer', label: 'Fae/Faer' },
      { value: 'xe/xem', label: 'Xe/Xem' },
      { value: 'ze/hir', label: 'Ze/Hir' },
      { value: 'ze/zir', label: 'Ze/Zir' },
    ],
  },
  {
    label: 'Other Neopronouns',
    options: [
      { value: 'co/cos', label: 'Co/Cos' },
      { value: 'e/em/eir', label: 'E/Em/Eir' },
      { value: 'e/em/es', label: 'E/Em/Es' },
      { value: 'hu/hum', label: 'Hu/Hum' },
      { value: 'ne/nem', label: 'Ne/Nem' },
      { value: 'ne/nir', label: 'Ne/Nir' },
      { value: 'per/per', label: 'Per/Per' },
      { value: 's/he/hir', label: 'S/He/Hir' },
      { value: 'thon/thons', label: 'Thon/Thons' },
      { value: 've/ver', label: 'Ve/Ver' },
      { value: 'vi/vir', label: 'Vi/Vir' },
      { value: 'vi/vim', label: 'Vi/Vim' },
      { value: 'zhe/zher', label: 'Zhe/Zher' },
    ],
  },
  {
    label: 'Other',
    options: [
      { value: 'any', label: 'Any' },
      { value: 'ask', label: 'Ask' },
      { value: 'custom', label: 'Custom' },
    ],
  },
];

type Props = {
  initialData: Profile;
};

const schema = z.object({
  bio: z.string().min(1).max(160).optional(),
  pronouns: z.string().min(1).max(32).optional(),
  website: z.string().min(1).max(256).url().optional(),
  phone: z.string().min(1).max(32).optional(),
});

type FormInput = z.infer<typeof schema>;

export default function ProfileForm({ initialData }: Props) {
  const qc = useQueryClient();

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: initialData.bio ?? undefined,
      pronouns: initialData.pronouns ?? undefined,
      website: initialData.website ?? undefined,
      phone: initialData.phone ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationKey: ['profile'],
    mutationFn: async (data: FormInput) => {
      const res = await rpc(() =>
        api.users.profile.$patch({
          json: data,
        })
      );
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ['profile'],
      });
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 max-w-xl space-y-8"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  {...field}
                />
              </FormControl>
              <FormDescription>Let us know about you</FormDescription>
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
          name="pronouns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pronouns</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pronoun" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pronounGroups.map((pgroup) => (
                    <SelectGroup key={pgroup.label}>
                      <SelectLabel>{pgroup.label}</SelectLabel>
                      {pgroup.options.map((p) => (
                        <SelectItem
                          key={p.value}
                          value={p.value}
                        >
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a pronoun from the list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
