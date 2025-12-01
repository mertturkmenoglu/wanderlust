import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import { AlertTriangleIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';
import { DeleteButton } from './-delete-button';
import { asVisibility, schema, visibilityOptions } from './-schema';

export const Route = createFileRoute('/trips/$id/edit/')({
	component: RouteComponent,
});

const datetimeFormat = "yyyy-MM-dd'T'HH:mm";

function RouteComponent() {
	const rootRoute = getRouteApi('/trips/$id');
	const { trip } = rootRoute.useLoaderData();
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			description: trip.description,
			startAt: formatDate(trip.startAt, datetimeFormat),
			endAt: formatDate(trip.endAt, datetimeFormat),
			visibility: asVisibility(trip.visibilityLevel),
			title: trip.title,
		},
	});

	const updateTripMutation = useMutation(
		orpc.trips.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Trip updated');
			},
		}),
	);

	return (
		<div>
			<form
				onSubmit={form.handleSubmit((data) => {
					updateTripMutation.mutate({
						id: trip.id,
						description: data.description,
						endAt: new Date(data.endAt),
						startAt: new Date(data.startAt),
						title: data.title,
						visibilityLevel: data.visibility,
					});
				})}
				className="flex w-full flex-col"
			>
				<DeleteButton className="mt-4 self-end" />

				<div className="mt-4">
					<Label htmlFor="title">Title</Label>
					<Input
						type="text"
						id="title"
						placeholder="My Awesome Trip"
						autoComplete="off"
						className="mt-1"
						{...form.register('title')}
					/>
					{form.formState.errors.title && (
						<span>{form.formState.errors.title.message}</span>
					)}
				</div>

				<div className="mt-4">
					<Label htmlFor="desc">Description</Label>
					<Textarea
						id="desc"
						placeholder="You can add a description for you trip."
						autoComplete="off"
						className="mt-1"
						{...form.register('description')}
					/>
					{form.formState.errors.description && (
						<span>{form.formState.errors.description.message}</span>
					)}
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
									<span>
										{visibilityOptions.find((op) => op.value === field.value)
											?.info ?? ''}
									</span>
								</div>
							);
						}}
					/>
					{form.formState.errors.visibility && (
						<span>{form.formState.errors.visibility.message}</span>
					)}
				</div>

				<div className="mt-4">
					<Label htmlFor="startAt">Start Date</Label>
					<Input
						id="startAt"
						type="datetime-local"
						className="mt-1"
						{...form.register('startAt')}
					/>
					{form.formState.errors.startAt && (
						<span>{form.formState.errors.startAt.message}</span>
					)}
				</div>

				<div className="mt-4">
					<Label htmlFor="endAt">End Date</Label>
					<Input
						id="endAt"
						type="datetime-local"
						placeholder='Format: "YYYY-MM-DD"'
						className="mt-1"
						{...form.register('endAt')}
					/>
					{form.formState.errors.endAt && (
						<span>{form.formState.errors.endAt.message}</span>
					)}
				</div>

				<div className="mt-4 flex items-center">
					<div className="flex max-w-sm gap-2 text-muted-foreground text-xs">
						<AlertTriangleIcon className="size-6 text-yellow-400" />
						If you change start or end date, we will automatically move the
						locations to the new date range.
					</div>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						className="ml-auto"
						asChild
					>
						<Link
							to="/trips/$id"
							params={{
								id: trip.id,
							}}
						>
							Cancel
						</Link>
					</Button>
					<Button type="submit" size="sm" variant="default" className="ml-2">
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}
