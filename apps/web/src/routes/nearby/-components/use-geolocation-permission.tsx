import { useQuery } from '@tanstack/react-query';

export function useGeolocationPermission() {
	return useQuery({
		queryKey: ['geolocation-permission'],
		queryFn: () => {
			return new Promise<[number, number]>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						return resolve([pos.coords.latitude, pos.coords.longitude]);
					},
					(err) => {
						return reject(err.message);
					},
					{
						timeout: 100_000,
					},
				);
			});
		},
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	});
}
