import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

const schema = z.object({
	fullName: z.string().min(1).max(128),
	bio: z.string().max(255).optional(),
	website: z.string().max(255).optional(),
});

export function Form() {
	const invalidate = useInvalidator();
	const { profile } = useLoaderData({ from: '/settings/profile/' });

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: profile.name,
			bio: profile.bio ?? undefined,
			website: profile.website ?? undefined,
		},
	});

	const mutation = useMutation(
		orpc.users.update.mutationOptions({
			onSuccess: async (newUser) => {
				await invalidate();
				await authClient.updateUser({
					bio: newUser.profile.bio,
					image: newUser.profile.image ?? undefined,
					name: newUser.profile.name,
					username: newUser.profile.username,
					website: newUser.profile.website,
				});
				toast.success('Profile updated');
			},
		}),
	);

	return (
		<form
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					bio: data.bio || null,
					name: data.fullName,
					website: data.website || null,
				});
			})}
		>
			<FieldGroup className="max-w-xl gap-4 md:gap-8">
				<Controller
					name="fullName"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input
								{...field}
								id="name"
								placeholder="name"
								autoComplete="name"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="bio"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="bio">About You</FieldLabel>
							<Textarea
								{...field}
								id="bio"
								placeholder="Tell us about yourself"
								autoComplete="off"
								rows={6}
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="website"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="website">Website</FieldLabel>
							<Input
								{...field}
								id="website"
								placeholder="https://example.com"
								type="url"
								autoComplete="url"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
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
