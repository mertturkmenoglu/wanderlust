import type { Outputs } from '@/lib/orpc';

type TTrip = Outputs['trips']['list']['trips'][number];

export type TVisibilityLevel = TTrip['visibilityLevel'];

export type TripItemProps = {
	trip: TTrip;
};
