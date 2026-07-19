import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@wanderlust/ui/components/button';
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
import { Textarea } from '@wanderlust/ui/components/textarea';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { useUpsertDirtyEventListener } from '@/hooks/use-upsert-dirty-event-listener';
import { getIANANames } from '@/lib/timezone';
import { type City, citiesResource as res } from '@/resources/cities';

const schema = z.object({
	id: z.string(),
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
	attributions: z
		.object({
			type: z.string().min(1).max(64),
			text: z.string().min(1).max(256),
			link: z.string().url().max(256),
		})
		.array(),
});

export function Upsert({ action, entity }: UpsertProps<City>) {
	const [previewUrl, setPreviewUrl] = useState(entity?.image ?? '');
	const tzOptions = useMemo(() => getIANANames(), []);

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: entity ?? {},
	});

	const create = res.useCreate();

	const edit = res.useUpdate();

	const onSubmit = form.handleSubmit(
		(data) => {
			if (action === 'create') {
				create.mutate(data);
			} else {
				edit.mutate(data, {
					onSuccess: (v) => {
						form.reset(v.city);
					},
				});
			}
		},
		(err) => {
			console.error('Form submission error:', err);
		},
	);

	useUpsertDirtyEventListener(form);

	const { Element } = useFormElement(form.control);

	return (
		<div>
			{previewUrl !== '' && (
				<img
					src={previewUrl}
					alt="Preview"
					className="mt-8 aspect-video w-64 rounded-md object-cover"
				/>
			)}

			<form onSubmit={onSubmit}>
				<FormContainer action={action}>
					<Element name="id" label="ID">
						{(r, id) => (
							<Input
								{...r.field}
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="ID"
								value={r.field.value}
								onChange={(e) => r.field.onChange(Number(e.target.value))}
								disabled={action === 'edit'}
							/>
						)}
					</Element>

					<Element name="name" label="Name">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Name"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="stateCode" label="State Code">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="State Code"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="stateName" label="State Name">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="State Name"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="countryCode" label="Country Code">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Country Code"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="countryName" label="Country Name">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Country Name"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="image" label="Image URL">
						{(r, id) => (
							<InputGroup>
								<InputGroupInput
									{...r.field}
									id={id}
									placeholder="https://example.com/image.jpg"
									aria-invalid={r.fieldState.invalid}
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
						)}
					</Element>

					<Element name="lat" label="Latitude">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Latitude"
								value={r.field.value}
								onChange={(e) => r.field.onChange(Number(e.target.value))}
							/>
						)}
					</Element>

					<Element name="lng" label="Longitude">
						{(r, id) => (
							<Input
								id={id}
								aria-invalid={r.fieldState.invalid}
								placeholder="Longitude"
								value={r.field.value}
								onChange={(e) => r.field.onChange(Number(e.target.value))}
							/>
						)}
					</Element>

					<Button
						type="button"
						variant="link"
						className="ml-auto px-0"
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

					<Element name="description" label="Description">
						{(r, id) => (
							<Textarea
								id={id}
								aria-invalid={r.fieldState.invalid}
								rows={6}
								placeholder="Description"
								{...r.field}
							/>
						)}
					</Element>

					<Element name="timezone" label="Timezone">
						{(r, id) => (
							<Select {...r.field}>
								<SelectTrigger
									id={id}
									aria-invalid={r.fieldState.invalid}
									className="min-w-32"
								>
									<SelectValue placeholder="Timezone" />
								</SelectTrigger>
								<SelectContent position="popper" align="end">
									{tzOptions.map((tz) => (
										<SelectItem key={tz} value={tz}>
											{tz}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</Element>

					<SubmitButton
						action={action}
						isLoading={create.isPending || edit.isPending}
					/>
				</FormContainer>
			</form>
		</div>
	);
}
