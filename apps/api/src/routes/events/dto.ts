import z from 'zod';

export const createInput = z.object({});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({});

export type CreateOutput = z.infer<typeof createOutput>;

export const getInput = z.object({
	id: z.string(),
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({});

export type GetOutput = z.infer<typeof getOutput>;

export const listInput = z.object({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({});

export type ListOutput = z.infer<typeof listOutput>;

export const updateInput = z.object({});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = z.object({});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateAmenitiesInput = z.object({});

export type UpdateAmenitiesInput = z.infer<typeof updateAmenitiesInput>;

export const updateAmenitiesOutput = z.object({});

export type UpdateAmenitiesOutput = z.infer<typeof updateAmenitiesOutput>;

export const updateFaqInput = z.object({});

export type UpdateFaqInput = z.infer<typeof updateFaqInput>;

export const updateFaqOutput = z.object({});

export type UpdateFaqOutput = z.infer<typeof updateFaqOutput>;

export const updateCategoriesInput = z.object({});

export type UpdateCategoriesInput = z.infer<typeof updateCategoriesInput>;

export const updateCategoriesOutput = z.object({});

export type UpdateCategoriesOutput = z.infer<typeof updateCategoriesOutput>;

export const updateTicketOptionsInput = z.object({});

export type UpdateTicketOptionsInput = z.infer<typeof updateTicketOptionsInput>;

export const updateTicketOptionsOutput = z.object({});

export type UpdateTicketOptionsOutput = z.infer<
	typeof updateTicketOptionsOutput
>;

export const updateAgendaInput = z.object({});

export type UpdateAgendaInput = z.infer<typeof updateAgendaInput>;

export const updateAgendaOutput = z.object({});

export type UpdateAgendaOutput = z.infer<typeof updateAgendaOutput>;

export const updateLineupInput = z.object({});

export type UpdateLineupInput = z.infer<typeof updateLineupInput>;

export const updateLineupOutput = z.object({});

export type UpdateLineupOutput = z.infer<typeof updateLineupOutput>;

export const createAssetInput = z.object({});

export type CreateAssetInput = z.infer<typeof createAssetInput>;

export const createAssetOutput = z.object({});

export type CreateAssetOutput = z.infer<typeof createAssetOutput>;

export const updateAssetsInput = z.object({});

export type UpdateAssetsInput = z.infer<typeof updateAssetsInput>;

export const updateAssetsOutput = z.object({});

export type UpdateAssetsOutput = z.infer<typeof updateAssetsOutput>;

export const deleteAssetInput = z.object({});

export type DeleteAssetInput = z.infer<typeof deleteAssetInput>;

export const deleteAssetOutput = z.object({});

export type DeleteAssetOutput = z.infer<typeof deleteAssetOutput>;

export const addToInterestedEventsInput = z.object({});

export type AddToInterestedEventsInput = z.infer<
	typeof addToInterestedEventsInput
>;

export const addToInterestedEventsOutput = z.object({});

export type AddToInterestedEventsOutput = z.infer<
	typeof addToInterestedEventsOutput
>;

export const listMyInterestedEventsInput = z.object({});

export type ListMyInterestedEventsInput = z.infer<
	typeof listMyInterestedEventsInput
>;

export const listMyInterestedEventsOutput = z.object({});

export type ListMyInterestedEventsOutput = z.infer<
	typeof listMyInterestedEventsOutput
>;

export const deleteFromMyInterestedEventsInput = z.object({});

export type DeleteFromMyInterestedEventsInput = z.infer<
	typeof deleteFromMyInterestedEventsInput
>;

export const deleteFromMyInterestedEventsOutput = z.object({});

export type DeleteFromMyInterestedEventsOutput = z.infer<
	typeof deleteFromMyInterestedEventsOutput
>;

export const listByPlaceIdInput = z.object({});

export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

export const listByPlaceIdOutput = z.object({});

export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

export const listByOrganizerIdInput = z.object({});

export type ListByOrganizerIdInput = z.infer<typeof listByOrganizerIdInput>;

export const listByOrganizerIdOutput = z.object({});

export type ListByOrganizerIdOutput = z.infer<typeof listByOrganizerIdOutput>;

export const listInterestedFriendsInput = z.object({});

export type ListInterestedFriendsInput = z.infer<
	typeof listInterestedFriendsInput
>;

export const listInterestedFriendsOutput = z.object({});

export type ListInterestedFriendsOutput = z.infer<
	typeof listInterestedFriendsOutput
>;
