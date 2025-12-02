import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { UpdateImage } from './-update-image';

const schema = z.object({
	fullName: z.string().min(1).max(128),
	bio: z.string().max(255).nullable(),
	website: z.string().max(255).nullable(),
});

export const Route = createFileRoute('/settings/profile/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { auth } = Route.useRouteContext();
	const user = auth.user;
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: user.name,
			bio: user.bio ?? undefined,
			website: user.website ?? undefined,
		},
	});

	const mutation = useMutation(
		orpc.users.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Profile updated');
			},
		}),
	);

	return (
		<div>
			<h2 className="font-semibold text-2xl tracking-tight first:mt-0">
				Profile
			</h2>

			<div className="mt-4 grid grid-cols-3 items-center gap-4">
				<Label>Profile Image</Label>
				<div className="col-span-2 flex">
					<UpdateImage
						fullName={user.name}
						image={user.image ?? null}
						fallbackImage="/profile.png"
						action="profile"
					/>
				</div>

				<Label>Banner Image</Label>
				<div className="col-span-2 flex">
					<UpdateImage
						fullName={user.name}
						image={user.banner ?? null}
						fallbackImage="https://i.imgur.com/EwvUEmR.jpg"
						action="banner"
					/>
				</div>
			</div>

			<Separator className="my-4" />

			<form
				onSubmit={form.handleSubmit((data) => {
					mutation.mutate({
						bio: data.bio || null,
						name: data.fullName,
						website: data.website || null,
					});
				})}
				className="mt-4 grid grid-cols-3 gap-4 md:gap-8"
			>
				<Label htmlFor="name" className="mt-2">
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
					{form.formState.errors.fullName && (
						<span>{form.formState.errors.fullName.message}</span>
					)}
				</div>

				<Label htmlFor="bio" className="mt-2">
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
					{form.formState.errors.bio && (
						<span>{form.formState.errors.bio.message}</span>
					)}
				</div>

				<Label htmlFor="website" className="mt-2">
					Website
				</Label>
				<div className="col-span-2">
					<Input
						id="website"
						type="url"
						placeholder="Your website"
						autoComplete="url"
						{...form.register('website')}
					/>
					{form.formState.errors.website && (
						<span>{form.formState.errors.website.message}</span>
					)}
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
