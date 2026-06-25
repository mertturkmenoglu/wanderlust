import z from 'zod';

export const updateTripAmenitiesSchema = z.object({
	amenities: z.array(z.string()).optional(),
});

export type UpdateTripAmenitiesFormInput = z.infer<
	typeof updateTripAmenitiesSchema
>;
