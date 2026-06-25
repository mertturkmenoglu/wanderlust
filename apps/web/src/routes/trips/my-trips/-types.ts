import type { Outputs } from "@/lib/orpc";

export type TTrip = Outputs['trips']['list']['trips'][number];

export type TVisibilityLevel = TTrip['visibilityLevel'];

export type TripItemProps = {
	trip: TTrip;
}
