import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Separator } from '@wanderlust/ui/components/separator';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useUpsert } from '@/hooks/use-upsert';
import { type Outputs, orpc } from '@/lib/orpc';
import { getIANANames } from '@/lib/timezone';

const schema = z.object({
	id: z.transform(Number).pipe(z.number().min(1)),
	name: z.string().min(1).max(64),
	stateCode: z.string().min(1).max(16),
	stateName: z.string().min(1).max(64),
	countryCode: z.string().length(2),
	countryName: z.string().min(1).max(64),
	image: z.string().min(1).max(256),
	lat: z.transform(Number).pipe(z.number().min(-90).max(90)),
	lng: z.transform(Number).pipe(z.number().min(-180).max(180)),
	description: z.string().min(1).max(4096),
	timezone: z.string().min(1).max(64),
});

type City = Outputs['cities']['list']['cities'][number];

export type UpsertProps = {
	action: 'create' | 'edit';
	city?: City;
};

export function Upsert({ action, city }: UpsertProps) {
	const [previewUrl, setPreviewUrl] = useState(city?.image ?? '');
	const navigate = useNavigate();
	const invalidate = useInvalidator();
	const tzOptions = useMemo(() => getIANANames(), []);

	const upsert = useUpsert({
		action,
		resolver: zodResolver(schema),
		entity: city,
		edit: orpc.cities.update.mutationOptions({
			onSuccess: async (v) => {
				await invalidate();
				await navigate({
					to: '/dashboard/cities/$id',
					params: {
						id: v.city.id.toString(),
					},
				});
			},
		}),
		create: orpc.cities.create.mutationOptions({
			onSuccess: async (v) => {
				await navigate({
					to: '/dashboard/cities/$id',
					params: { id: v.city.id.toString() },
				});
			},
		}),
	});

	const onSubmit = upsert.form.handleSubmit((data) => {
		if (action === 'create') {
			upsert.create.mutate(data);
		} else {
			upsert.edit.mutate(data);
		}
	});

	const crumbs = useBreadcrumbs();

	return (
		<div>
			<Breadcrumbs crumbs={crumbs} />

			<Separator className="my-4" />

			{previewUrl !== '' && (
				<img
					src={previewUrl}
					alt="Preview"
					className="mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form onSubmit={onSubmit}>
				<FieldGroup className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
					<Controller
						name="id"
						control={upsert.form.control}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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
											disabled={upsert.form.watch('image') === ''}
											onClick={() => setPreviewUrl(upsert.form.watch('image'))}
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
						control={upsert.form.control}
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
						control={upsert.form.control}
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

								upsert.form.setValue('lat', lat);
								upsert.form.setValue('lng', lng);
							}}
						>
							Paste from clipboard as GeoHack format
						</Button>
					</div>

					<Controller
						name="description"
						control={upsert.form.control}
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

					<Controller
						name="timezone"
						control={upsert.form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								orientation="horizontal"
								className="col-span-full"
							>
								<FieldContent>
									<FieldLabel htmlFor="timezone">Timezone</FieldLabel>
									<FieldDescription>
										City's timezone in IANA format (e.g., America/New_York)
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</FieldDescription>
								</FieldContent>

								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										id="timezone"
										aria-invalid={fieldState.invalid}
										className="min-w-32"
									>
										<SelectValue placeholder="Timezone" />
									</SelectTrigger>
									<SelectContent position="popper" align="end">
										{tzOptions.map((ianaName) => (
											<SelectItem key={ianaName} value={ianaName}>
												{ianaName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<div className="col-span-full mt-8 flex items-center justify-end gap-2">
						<Button
							variant="default"
							type="submit"
							disabled={upsert.create.isPending || upsert.edit.isPending}
						>
							{(upsert.create.isPending || upsert.edit.isPending) && (
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
