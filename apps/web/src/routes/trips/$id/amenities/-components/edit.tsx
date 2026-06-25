import { useParams } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { Checkbox } from '@wanderlust/ui/components/checkbox';
import { Label } from '@wanderlust/ui/components/label';
import { Controller } from 'react-hook-form';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { useTripAmenitiesContext } from './context';
import {
	useListAmenitiesQuery,
	useUpdateTripAmenitiesForm,
	useUpdateTripAmenitiesMutation,
} from './hooks';

export function Edit() {
	const ctx = useTripAmenitiesContext();
	const params = useParams({ from: '/trips/$id/amenities/' });
	const query = useListAmenitiesQuery();
	const amenities = query.data.amenities;

	const form = useUpdateTripAmenitiesForm();
	const mutation = useUpdateTripAmenitiesMutation();

	const onSubmit = form.handleSubmit((data) => {
		mutation.mutate(
			{
				id: params.id,
				amenities: data.amenities ?? [],
			},
			{
				onSuccess: () => {
					ctx.setIsEditMode(false);
				},
			},
		);
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update Amenities</CardTitle>
			</CardHeader>

			<CardContent>
				<form
					id="update-amenities-form"
					className="grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
					onSubmit={onSubmit}
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

															<Label className="ml-2 font-normal">
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
				</form>
			</CardContent>

			<CardFooter>
				<Button
					type="button"
					variant="ghost"
					onClick={() => {
						form.reset();
						mutation.reset();
						ctx.setIsEditMode(false);
					}}
					className="ml-auto"
				>
					Cancel
				</Button>

				<Button
					type="submit"
					form="update-amenities-form"
					disabled={mutation.isPending}
				>
					Update
				</Button>
			</CardFooter>
		</Card>
	);
}
