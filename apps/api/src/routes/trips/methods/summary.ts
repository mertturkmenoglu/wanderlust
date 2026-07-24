import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eachDayOfInterval } from 'date-fns';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { os } from '../internal/router';
import { TripProvider } from '../provides/trip';

@injectable()
export class GetTripSummaryMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(TripProvider) private readonly provider: TripProvider,
	) {}

	route() {
		return os.getSummary.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.GetSummaryInput,
	): Promise<Trips.dto.GetSummaryOutput> {
		const { trip } = await this.provider.find({
			userId,
			id: data.id,
			tx: this.db,
		});

		const totalCities = new Set(trip.locations.map((l) => l.place.wlCityId))
			.size;
		const totalDays = eachDayOfInterval({
			start: trip.startAt,
			end: trip.endAt,
		}).length;
		const totalParticipants = trip.participants.length + 1;
		const totalLocations = new Set(trip.locations.map((l) => l.place.id)).size;
		const totalComments = await this.db.$count(
			schema.tripComments,
			eq(schema.tripComments.tripId, trip.id),
		);

		const totalItineraryItems = 0;
		const totalAssets = 0;

		return {
			trip: trip,
			totalCities,
			totalDays,
			totalParticipants,
			totalLocations,
			totalComments,
			totalItineraryItems,
			totalAssets,
		};
	}
}
