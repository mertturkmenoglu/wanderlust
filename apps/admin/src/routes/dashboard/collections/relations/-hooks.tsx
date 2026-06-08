import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

export function usePlacesQuery() {
	return useQuery(
		orpc.collections.listAllPlaceCollections.queryOptions({
			input: {
				page: 1,
				pageSize: 50,
			},
		}),
	);
}

export function useCitiesQuery() {
	return useQuery(
		orpc.collections.listAllCityCollections.queryOptions({
			input: {
				page: 1,
				pageSize: 50,
			},
		}),
	);
}

export function useDeletePlaceRelationMutation() {
	const invalidate = useInvalidator();
	return useMutation(
		orpc.collections.deletePlaceRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation removed');
			},
		}),
	);
}

export function useDeleteCityRelationMutation() {
	const invalidate = useInvalidator();
	return useMutation(
		orpc.collections.deleteCityRelation.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Relation removed');
			},
		}),
	);
}
