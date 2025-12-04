import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { ipx } from '@/lib/ipx';
import { type Outputs, orpc } from '@/lib/orpc';

const schema = z.object({
	id: z.coerce.number().min(1),
	name: z.string().min(1).max(64),
	stateCode: z.string().min(1).max(16),
	stateName: z.string().min(1).max(64),
	countryCode: z.string().length(2),
	countryName: z.string().min(1).max(64),
	image: z.string().min(1).max(256),
	lat: z.coerce.number().min(-90).max(90),
	lng: z.coerce.number().min(-180).max(180),
	description: z.string().min(1).max(4096),
});

type Props = {
	action: 'create' | 'edit';
	city?: Outputs['cities']['get']['city'];
};

export function UpsertCity({ action, city }: Props) {
	const [previewUrl, setPreviewUrl] = useState(city?.image ?? '');

	const navigate = useNavigate();
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: city
			? {
					...city,
				}
			: undefined,
	});

	const createMutation = useMutation(
		orpc.cities.create.mutationOptions({
			onSuccess: async () => {
				toast.success('City created');
				await navigate({ to: '/dashboard/cities', reloadDocument: true });
			},
		}),
	);

	const editMutation = useMutation(
		orpc.cities.update.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				await navigate({
					to: '/dashboard/cities/$id',
					params: {
						id: '',
					},
				});
				toast.success('City updated');
			},
		}),
	);

	return (
		<div>
			<DashboardBreadcrumb
				items={
					action === 'create'
						? [
								{ name: 'Cities', href: '/dashboard/cities' },
								{ name: 'New', href: '/dashboard/cities/new' },
							]
						: [
								{ name: 'Cities', href: '/dashboard/cities' },
								{
									name: city?.name ?? '',
									href: `/dashboard/cities/${city?.id ?? ''}`,
								},
								{
									name: 'Edit',
									href: `/dashboard/cities/${city?.id ?? ''}/edit`,
								},
							]
				}
			/>

			<Separator className="my-4" />

			{previewUrl !== '' && (
				<img
					src={ipx(previewUrl, 'w_512')}
					alt="Preview"
					className="mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form
				className="mx-0 mt-8 max-w-7xl"
				onSubmit={form.handleSubmit((data) => {
					if (action === 'create') {
						createMutation.mutate(data);
					} else {
						if (!city) return;

						editMutation.mutate({
							...data,
							id: city.id,
						});
					}
				})}
			>
				<FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Controller
						name="id"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="id">ID</FieldLabel>
								<Input
									{...field}
									id="id"
									placeholder="ID"
									disabled={action === 'edit'}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									{...field}
									id="name"
									placeholder="Name"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="stateCode"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="stateCode">State Code</FieldLabel>
								<Input
									{...field}
									id="stateCode"
									placeholder="State Code"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="stateName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="stateName">State Name</FieldLabel>
								<Input
									{...field}
									id="stateName"
									placeholder="State Name"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="countryCode"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="countryCode">Country Code</FieldLabel>
								<Input
									{...field}
									id="countryCode"
									placeholder="Country Code"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="countryName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="countryName">Country Name</FieldLabel>
								<Input
									{...field}
									id="countryName"
									placeholder="Country Name"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="image"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="image">Image URL</FieldLabel>

								<InputGroup>
									<InputGroupInput
										{...field}
										id="image"
										placeholder="https://example.com/image.jpg"
										aria-invalid={fieldState.invalid}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											type="button"
											variant="link"
											size="sm"
											disabled={form.watch('image') === ''}
											onClick={() => setPreviewUrl(form.watch('image'))}
										>
											Preview
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>

								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<div />

					<Controller
						name="lat"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="lat">Latitude</FieldLabel>
								<Input
									{...field}
									id="lat"
									placeholder="Latitude"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="lng"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="lng">Longitude</FieldLabel>
								<Input
									{...field}
									id="lng"
									placeholder="Longitude"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<div className="col-span-full">
						<Button
							type="button"
							variant="link"
							className="px-0"
							onClick={async () => {
								const text = await navigator.clipboard.readText();
								const [lat, lng] = text
									.split(', ')
									.map((s) => Number.parseFloat(s));
								if (
									lat === undefined ||
									lng === undefined ||
									Number.isNaN(lat) ||
									Number.isNaN(lng)
								) {
									toast.error('Invalid GeoHack format');
									return;
								}

								form.setValue('lat', lat);
								form.setValue('lng', lng);
							}}
						>
							Paste from clipboard as GeoHack format
						</Button>
					</div>

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="col-span-full"
							>
								<FieldLabel htmlFor="description">Description</FieldLabel>
								<Textarea
									{...field}
									id="description"
									placeholder="Description"
									rows={6}
									autoComplete="off"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<div className="col-span-full flex items-center justify-end gap-2">
						<Button
							variant="default"
							type="submit"
							disabled={createMutation.isPending || editMutation.isPending}
						>
							{(createMutation.isPending || editMutation.isPending) && (
								<Spinner className="text-white!" />
							)}
							<span>{action === 'create' ? 'Create City' : 'Edit City'}</span>
						</Button>
					</div>
				</FieldGroup>
			</form>
		</div>
	);
}
