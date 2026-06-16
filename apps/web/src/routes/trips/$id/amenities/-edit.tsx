import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import { Label } from '@wanderlust/ui/components/label';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AppMessage } from '@/components/app-message';
import { useInvalidator } from '@/hooks/use-invalidator';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { orpc } from '@/lib/orpc';

const schema = z.object({
	amenities: z.array(z.string()).optional(),
});

export function Edit() {
	const { trip } = useLoaderData({
		from: '/trips/$id',
	});

	const query = useQuery(
		orpc.amenities.list.queryOptions({
			input: {},
		}),
	);

	const amenities = query.data?.amenities ?? [];
	const invalidate = useInvalidator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			amenities: trip.requestedAmenities,
		},
	});

	const mutation = useMutation(
		orpc.trips.updateRequestedAmenities.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Amenities updated successfully');
			},
		}),
	);

	if (query.isPending) {
		return <Spinner className="mx-auto my-8" />;
	}

	if (query.isError) {
		return (
			<AppMessage
				error="Failed to load amenities"
				classNames={{ root: 'my-8' }}
			/>
		);
	}

	return (
		<form
			className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate({
					id: trip.id,
					amenities: data.amenities ?? [],
				});
			})}
		>
			<div className="col-span-2">
				<Controller
					name="amenities"
					control={form.control}
					render={() => {
						return (
							<div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-4">
								{amenities.map((amenity) => (
									<Controller
										key={amenity}
										control={form.control}
										name="amenities"
										render={({ field }) => {
											return (
												<div className="flex items-center gap-1">
													<Checkbox
														checked={field.value?.includes(amenity)}
														onCheckedChange={(checked) => {
															return checked
																? field.onChange([
																		...(field.value ?? []),
																		amenity,
																	])
																: field.onChange(
																		field.value?.filter(
																			(value) => value !== amenity,
																		),
																	);
														}}
													/>

													<Label className="font-normal">
														{amenitiesDisplayNames.get(amenity) ?? amenity}
													</Label>
												</div>
											);
										}}
									/>
								))}
							</div>
						);
					}}
				/>
				{form.formState.errors.amenities?.root && (
					<span className="text-destructive text-sm">
						{form.formState.errors.amenities?.root.message}
					</span>
				)}
			</div>

			<Button
				type="submit"
				disabled={mutation.isPending}
				className="col-span-full"
			>
				Save
			</Button>
		</form>
	);
}
