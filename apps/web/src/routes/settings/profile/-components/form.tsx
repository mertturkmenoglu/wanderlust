import { zodResolver } from '@hookform/resolvers/zod';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { FieldGroup } from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { useForm } from 'react-hook-form';
import { cmp } from '@/components/form';
import {
	type UpdateUserProfileFormInput,
	updateUserProfileSchema,
} from '@/schemas/update-user-profile';
import { useUpdateUserProfileMutation } from './hooks';

export function Form() {
	const { profile } = useLoaderData({ from: '/settings/profile/' });

	const form = useForm<UpdateUserProfileFormInput>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			fullName: profile.name,
			bio: profile.bio ?? undefined,
			website: profile.website ?? undefined,
			location: profile.location ?? undefined,
		},
	});

	const mutation = useUpdateUserProfileMutation();

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate({
			bio: data.bio || null,
			name: data.fullName,
			website: data.website || null,
			location: data.location || null,
		});
	});

	return (
		<form onSubmit={onSubmit}>
			<FieldGroup className="max-w-xl gap-4 md:gap-8">
				<cmp.Input
					name="fullName"
					control={form.control}
					elements={{
						label: {
							children: 'Full Name',
						},
						input: {
							placeholder: 'Full Name',
							autoComplete: 'name',
						},
					}}
				/>

				<cmp.Textarea
					name="bio"
					control={form.control}
					elements={{
						label: {
							children: 'About You',
						},
						textarea: {
							placeholder: 'Tell us about yourself',
							autoComplete: 'off',
							rows: 6,
						},
					}}
				/>

				<cmp.Input
					name="website"
					control={form.control}
					elements={{
						input: {
							placeholder: 'https://example.com',
							autoComplete: 'url',
							type: 'url',
						},
					}}
				/>

				<cmp.Input
					name="location"
					control={form.control}
					elements={{
						input: {
							placeholder: 'New York, USA',
						},
					}}
				/>

				<Button
					type="submit"
					className="ml-auto w-fit"
					disabled={mutation.isPending}
				>
					{mutation.isPending && <Spinner className="mr-2" />}
					Update
				</Button>
			</FieldGroup>
		</form>
	);
}
