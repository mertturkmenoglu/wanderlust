import { getRouteApi } from '@tanstack/react-router';
import { createContext, type PropsWithChildren, useContext } from 'react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import type { TripParticipant } from './types';

type State = {
	isPrivileged: boolean;
	canInvite: boolean;
	allParticipants: TripParticipant[];
};

export const TripParticipantsContext = createContext<State | null>(null);

type Props = PropsWithChildren;

export function TripParticipantsContextProvider({ children }: Props) {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const isPrivileged = useTripIsPrivileged();
	const canInvite = isPrivileged && trip.visibilityLevel !== 'private';
	const allParticipants: TripParticipant[] = [
		{
			id: '',
			tripId: trip.id,
			userId: trip.owner.id,
			role: 'owner',
			user: {
				id: trip.owner.id,
				name: trip.owner.name,
				username: trip.owner.username,
				image: trip.owner.image,
			},
		},
		...trip.participants,
	];

	return (
		<TripParticipantsContext.Provider
			value={{
				isPrivileged,
				canInvite,
				allParticipants,
			}}
		>
			{children}
		</TripParticipantsContext.Provider>
	);
}

export function useTripParticipantsContext() {
	const context = useContext(TripParticipantsContext);

	if (!context) {
		throw new Error(
			'useTripParticipantsContext must be used within a TripParticipantsContextProvider',
		);
	}

	return context;
}
