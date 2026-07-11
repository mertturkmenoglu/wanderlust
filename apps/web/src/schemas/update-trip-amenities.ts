import z from 'zod';

export const updateTripAmenitiesSchema = z.object({
	amenities: z.array(z.string()).optional(),
});
