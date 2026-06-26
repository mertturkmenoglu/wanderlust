import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';

type State = {
	isEditMode: boolean;
	setIsEditMode: Dispatch<SetStateAction<boolean>>;
	isPrivileged: boolean;
	canEdit: boolean;
};

export const TripAmenitiesContext = createContext<State | null>(null);

type Props = PropsWithChildren;

export function TripAmenitiesContextProvider({ children }: Props) {
	const [isEditMode, setIsEditMode] = useState(false);
	const isPrivileged = useTripIsPrivileged();
	const canEdit = isPrivileged;

	return (
		<TripAmenitiesContext.Provider
			value={{
				isEditMode,
				setIsEditMode,
				isPrivileged,
				canEdit,
			}}
		>
			{children}
		</TripAmenitiesContext.Provider>
	);
}

export function useTripAmenitiesContext() {
	const context = useContext(TripAmenitiesContext);

	if (!context) {
		throw new Error(
			'useTripAmenitiesContext must be used within a TripAmenitiesContextProvider',
		);
	}

	return context;
}
