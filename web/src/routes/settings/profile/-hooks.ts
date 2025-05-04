import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { schema, type FormInput } from './-schema';

export function useProfileForm(initialData: FormInput) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
}

export function useProfileMutation() {
  return api.useMutation('patch', '/api/v2/users/profile', {
    onSuccess: () => {
      window.location.reload();
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

// mutationFn: async (data: FormInput) => {
//     const dto: UpdateUserProfileRequestDto = {
//       fullName: data.fullName ?? null,
//       bio: data.bio ?? null,
//       pronouns: data.pronouns ?? null,
//       website: data.website ?? null,
//       phone: data.phone ?? null,
//     };

//     return await updateUserProfile(dto);
//   },
